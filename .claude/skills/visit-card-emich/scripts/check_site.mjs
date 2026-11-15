#!/usr/bin/env node
/** Статические проверки EMICH на Node.js без сторонних зависимостей. */

import { readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const PAGES = { "index.html": "ru", "en/index.html": "en", "fr/index.html": "fr", "it/index.html": "it" };
const URLS = {
  ru: "https://emich.ru/",
  en: "https://emich.ru/en/",
  fr: "https://emich.ru/fr/",
  it: "https://emich.ru/it/",
};
const HREFLANG = { ...URLS, "x-default": URLS.ru };
const REQUIRED = [
  ...Object.keys(PAGES), "styles.css", "app.js", "robots.txt", "sitemap.xml", "README.md",
  "2026-10-15_deploy-checklist_doc.md", "assets/favicon.svg", "assets/hero-art.jpg",
  "assets/mfti-video.mp4", "assets/mfti-video-poster.jpg",
];

const args = process.argv.slice(2);
const release = args.includes("--release");
const rootArg = args.find((arg) => !arg.startsWith("--")) || ".";
const root = path.resolve(rootArg);
const errors = [];
const warnings = [];
const blockers = [];

function location(file, line) {
  const name = path.relative(root, file).replaceAll(path.sep, "/") || path.basename(file);
  return line ? `${name}:${line}` : name;
}
function add(list, file, line, message) {
  list.push(`${location(file, line)} — ${message}`);
}
const error = (file, line, message) => add(errors, file, line, message);
const warn = (file, line, message) => add(warnings, file, line, message);
const block = (file, line, message) => add(blockers, file, line, message);
const lineAt = (text, index) => text.slice(0, index).split("\n").length;

function decodeEntities(value) {
  return value.replace(/&(?:amp|quot|apos|lt|gt|#39);/g, (entity) => ({
    "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">", "&#39;": "'",
  })[entity]);
}

function attributes(source) {
  const result = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of source.matchAll(pattern)) {
    result[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return result;
}

function parsePage(text) {
  const withoutComments = text.replace(/<!--[\s\S]*?-->/g, (comment) => comment.replace(/[^\n]/g, " "));
  const page = {
    html: {}, ids: new Map(), refs: [], fragments: [], i18n: new Set(), i18nPh: new Set(),
    canonicals: [], alternates: {}, ogUrls: [], jsonld: [],
  };
  const tags = withoutComments.matchAll(/<([a-zA-Z][\w:-]*)(\s[^<>]*?)?\s*\/?>/g);
  for (const match of tags) {
    const tag = match[1].toLowerCase();
    const attrs = attributes(match[2] || "");
    const line = lineAt(withoutComments, match.index);
    if (tag === "html") page.html = attrs;
    if (attrs.id) page.ids.set(attrs.id, (page.ids.get(attrs.id) || 0) + 1);
    if (attrs["data-i18n"]) page.i18n.add(attrs["data-i18n"]);
    if (attrs["data-i18n-ph"]) page.i18nPh.add(attrs["data-i18n-ph"]);
    for (const attr of ["src", "href", "poster"]) {
      if (!attrs[attr]) continue;
      page.refs.push({ ref: attrs[attr], line, attr });
      if (attrs[attr].startsWith("#") && attrs[attr].length > 1) {
        page.fragments.push({ id: decodeURIComponent(attrs[attr].slice(1)), line });
      }
    }
    if (attrs.srcset) {
      for (const candidate of attrs.srcset.split(",")) {
        const [ref] = candidate.trim().split(/\s+/);
        if (ref) page.refs.push({ ref, line, attr: "srcset" });
      }
    }
    if (tag === "link") {
      const rel = (attrs.rel || "").toLowerCase().split(/\s+/);
      if (rel.includes("canonical") && attrs.href) page.canonicals.push({ url: attrs.href, line });
      if (rel.includes("alternate") && attrs.hreflang && attrs.href) {
        page.alternates[attrs.hreflang] = { url: attrs.href, line };
      }
    }
    if (tag === "meta" && attrs.property === "og:url" && attrs.content) {
      page.ogUrls.push({ url: attrs.content, line });
    }
  }
  const scripts = withoutComments.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi);
  for (const match of scripts) {
    const attrs = attributes(match[1]);
    if ((attrs.type || "").toLowerCase() === "application/ld+json") {
      page.jsonld.push({ raw: match[2], line: lineAt(withoutComments, match.index) });
    }
  }
  return page;
}

function parseI18n(appText, appPath) {
  appText = appText.replace(/\r\n/g, "\n");
  const dictionaries = {};
  for (const lang of Object.values(PAGES)) {
    const match = appText.match(new RegExp(`^    ${lang}: \\{\\n([\\s\\S]*?)^    \\},?`, "m"));
    if (!match) {
      error(appPath, null, `не найден словарь I18N.${lang}`);
      continue;
    }
    dictionaries[lang] = new Set([...match[1].matchAll(/^\s*"([^"]+)"\s*:/gm)].map((item) => item[1]));
  }
  const allKeys = new Set(Object.values(dictionaries).flatMap((keys) => [...keys]));
  for (const [lang, keys] of Object.entries(dictionaries)) {
    const missing = [...allKeys].filter((key) => !keys.has(key)).sort();
    if (missing.length) error(appPath, null, `I18N.${lang}: отсутствуют ключи ${missing.join(", ")}`);
  }
  return { dictionaries, allKeys };
}

function localTarget(pagePath, ref) {
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(ref) || ref.startsWith("//")) return null;
  const rawPath = ref.split(/[?#]/, 1)[0];
  if (!rawPath) return null;
  let decoded;
  try {
    decoded = decodeURIComponent(rawPath);
  } catch {
    return "invalid";
  }
  let target = decoded.startsWith("/") ? path.resolve(root, `.${decoded}`) : path.resolve(path.dirname(pagePath), decoded);
  if (decoded.endsWith("/")) target = path.join(target, "index.html");
  return target;
}

function sameUrls(actual, expected) {
  const actualKeys = Object.keys(actual).sort();
  const expectedKeys = Object.keys(expected).sort();
  return JSON.stringify(actualKeys) === JSON.stringify(expectedKeys)
    && expectedKeys.every((key) => actual[key]?.url === expected[key] || actual[key] === expected[key]);
}

let baseKeys = null;
function checkPage(relative, lang, allKeys) {
  const file = path.join(root, relative);
  const text = readFileSync(file, "utf8");
  const page = parsePage(text);
  if (page.html.lang !== lang) error(file, 1, `ожидался html lang="${lang}", найден "${page.html.lang || ""}"`);
  const pinned = page.html["data-pinned-lang"];
  if (lang === "ru" && pinned !== undefined) error(file, 1, "у русской страницы не должно быть data-pinned-lang");
  if (lang !== "ru" && pinned !== lang) error(file, 1, `ожидался data-pinned-lang="${lang}", найден "${pinned || ""}"`);

  for (const [id, count] of page.ids) if (count > 1) error(file, null, `повторяется id="${id}"`);
  for (const fragment of page.fragments) if (!page.ids.has(fragment.id)) error(file, fragment.line, `якорь #${fragment.id} не найден`);
  for (const { ref, line, attr } of page.refs) {
    const target = localTarget(file, ref);
    if (target === null) continue;
    if (target === "invalid") {
      error(file, line, `некорректное URL-кодирование в ${attr}: ${ref}`);
      continue;
    }
    const relativeTarget = path.relative(root, target);
    if (relativeTarget.startsWith("..") || path.isAbsolute(relativeTarget)) {
      error(file, line, `${attr} ведёт за пределы репозитория: ${ref}`);
    } else if (!existsSync(target) || !statSync(target).isFile()) {
      error(file, line, `не найден локальный ресурс из ${attr}: ${ref}`);
    }
  }

  const keys = new Set([...page.i18n, ...page.i18nPh]);
  for (const key of [...keys].filter((key) => !allKeys.has(key)).sort()) error(file, null, `в I18N отсутствует ключ "${key}"`);
  if (lang === "ru") baseKeys = keys;
  else if (baseKeys && (keys.size !== baseKeys.size || [...keys].some((key) => !baseKeys.has(key)))) {
    error(file, null, "набор i18n-ключей отличается от index.html");
  }

  const expectedUrl = URLS[lang];
  if (page.canonicals.length !== 1 || page.canonicals[0].url !== expectedUrl) {
    error(file, null, `canonical должен быть единственным и равным ${expectedUrl}`);
  }
  if (!sameUrls(page.alternates, HREFLANG)) error(file, null, "canonical/hreflang: нужны ru, en, fr, it, x-default с корректными URL");
  if (page.ogUrls.length !== 1 || page.ogUrls[0].url !== expectedUrl) error(file, null, `og:url должен быть единственным и равным ${expectedUrl}`);

  if (page.jsonld.length !== 1) error(file, null, "ожидался один блок JSON-LD");
  for (const item of page.jsonld) {
    try {
      const data = JSON.parse(item.raw);
      if (data["@type"] !== "ProfessionalService") error(file, item.line, "JSON-LD: ожидался @type ProfessionalService");
    } catch (exc) {
      error(file, item.line, `некорректный JSON-LD: ${exc.message}`);
    }
  }

  if (text.includes("000-00-00") || text.includes("tel:+74950000000") || text.includes("ЗАМЕНИТЬ")) {
    (release ? block : warn)(file, null, "контактная заглушка или отметка ЗАМЕНИТЬ");
  }
}

function checkSitemap() {
  const file = path.join(root, "sitemap.xml");
  const text = readFileSync(file, "utf8");
  if (!/<urlset\b[^>]*xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/.test(text)) {
    error(file, null, "некорректное пространство имён sitemap");
  }
  const entries = [...text.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url\s*>/g)];
  const actualUrls = [];
  for (const entry of entries) {
    const loc = entry[1].match(/<loc>([\s\S]*?)<\/loc>/)?.[1]?.trim();
    if (!loc) {
      error(file, null, "в sitemap есть url без loc");
      continue;
    }
    actualUrls.push(loc);
    const alternates = {};
    for (const match of entry[1].matchAll(/<xhtml:link\b([^>]*)\/?\s*>/g)) {
      const attrs = attributes(match[1]);
      if (attrs.rel === "alternate") alternates[attrs.hreflang] = attrs.href;
    }
    if (!sameUrls(alternates, HREFLANG)) error(file, null, `sitemap: неверные alternate для ${loc}`);
  }
  const expectedUrls = Object.values(URLS);
  if (entries.length !== 4 || actualUrls.length !== new Set(actualUrls).size
      || expectedUrls.some((url) => !actualUrls.includes(url))) {
    error(file, null, "sitemap должен содержать ровно четыре уникальных языковых URL");
  }
  const robots = readFileSync(path.join(root, "robots.txt"), "utf8");
  if (!robots.includes("Sitemap: https://emich.ru/sitemap.xml")) error(path.join(root, "robots.txt"), null, "отсутствует корректная директива Sitemap");
}

console.log(`Проверка EMICH: ${root}`);
if (!existsSync(path.join(root, "index.html"))) {
  console.error(`ОШИБКА: ${root} не похож на корень проекта`);
  process.exit(2);
}
for (const relative of REQUIRED) {
  const file = path.join(root, relative);
  if (!existsSync(file) || !statSync(file).isFile()) error(file, null, "отсутствует обязательный файл");
}
if (!errors.length) {
  const appPath = path.join(root, "app.js");
  const { allKeys } = parseI18n(readFileSync(appPath, "utf8"), appPath);
  for (const [relative, lang] of Object.entries(PAGES)) checkPage(relative, lang, allKeys);
  checkSitemap();
}

for (const [title, items] of [["ОШИБКИ", errors], ["ПРЕДУПРЕЖДЕНИЯ", warnings], ["БЛОКЕРЫ ПУБЛИКАЦИИ", blockers]]) {
  if (!items.length) continue;
  console.log(`\n${title} (${items.length}):`);
  for (const item of items) console.log(`- ${item}`);
}
console.log(`\nИтог: ошибок ${errors.length}, предупреждений ${warnings.length}, блокеров публикации ${blockers.length}.`);
if (errors.length || (release && blockers.length)) {
  console.log("Проверка НЕ пройдена.");
  process.exit(1);
}
console.log("Статические проверки пройдены. Браузерная проверка всё ещё необходима для UI и JavaScript.");
