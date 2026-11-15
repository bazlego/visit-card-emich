#!/usr/bin/env node
/** Локальный статический сервер EMICH без сторонних зависимостей. */

import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const valueAfter = (flag, fallback) => args.includes(flag) ? args[args.indexOf(flag) + 1] : fallback;
const rootArg = args.find((arg, index) => !arg.startsWith("--") && !["--port", "--host"].includes(args[index - 1])) || ".";
const root = path.resolve(rootArg);
const host = valueAfter("--host", "127.0.0.1");
const port = Number(valueAfter("--port", "8000"));
if (typeof host !== "string" || !host || host.startsWith("--")) {
  console.error("Укажите корректный host после --host.");
  process.exit(2);
}
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("Порт должен быть целым числом от 1 до 65535.");
  process.exit(2);
}

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif",
  ".ico": "image/x-icon", ".mp4": "video/mp4", ".woff2": "font/woff2",
};

function sendText(response, status, message) {
  response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" });
  response.end(message);
}

const server = createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method || "")) {
      response.setHeader("Allow", "GET, HEAD");
      sendText(response, 405, "Метод не поддерживается");
      return;
    }
    const pathname = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
    if (pathname.includes("\0")) {
      sendText(response, 400, "Некорректный путь");
      return;
    }
    let file = path.resolve(root, `.${pathname}`);
    const relative = path.relative(root, file);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      sendText(response, 403, "Доступ запрещён");
      return;
    }
    let info;
    try {
      info = await stat(file);
    } catch {
      sendText(response, 404, "Файл не найден");
      return;
    }
    if (info.isDirectory()) {
      if (!pathname.endsWith("/")) {
        response.writeHead(308, { Location: `${pathname}/` });
        response.end();
        return;
      }
      file = path.join(file, "index.html");
      try {
        info = await stat(file);
      } catch {
        sendText(response, 404, "index.html не найден");
        return;
      }
    }
    if (!info.isFile()) {
      sendText(response, 404, "Файл не найден");
      return;
    }

    const headers = {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "Accept-Ranges": "bytes",
      "X-Content-Type-Options": "nosniff",
    };
    let start = 0;
    let end = info.size - 1;
    let status = 200;
    const range = request.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
      if (!match || (!match[1] && !match[2])) {
        response.writeHead(416, { "Content-Range": `bytes */${info.size}` });
        response.end();
        return;
      }
      if (!match[1]) {
        const suffix = Number(match[2]);
        start = Math.max(info.size - suffix, 0);
      } else {
        start = Number(match[1]);
        end = match[2] ? Math.min(Number(match[2]), info.size - 1) : info.size - 1;
      }
      if (start > end || start >= info.size) {
        response.writeHead(416, { "Content-Range": `bytes */${info.size}` });
        response.end();
        return;
      }
      status = 206;
      headers["Content-Range"] = `bytes ${start}-${end}/${info.size}`;
    }
    headers["Content-Length"] = end - start + 1;
    response.writeHead(status, headers);
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    const stream = createReadStream(file, { start, end });
    stream.on("error", () => response.destroy());
    stream.pipe(response);
  } catch (error) {
    sendText(response, error instanceof URIError ? 400 : 500, error instanceof URIError ? "Некорректный URL" : "Внутренняя ошибка сервера");
  }
});

server.on("error", (error) => {
  console.error(error.code === "EADDRINUSE" ? `Порт ${port} занят. Выберите другой через --port.` : error.message);
  process.exitCode = 1;
});
server.listen(port, host, () => {
  console.log(`EMICH: http://${host}:${port}/`);
  console.log(`Корень: ${root}`);
  console.log("Остановка: Ctrl+C");
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
