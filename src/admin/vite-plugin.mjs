import { exec } from "node:child_process";
import {
	existsSync,
	readFileSync,
	readdirSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { join, resolve, sep } from "node:path";

/**
 * 写作终端（dev-only）Vite 插件。
 *
 * 为什么不用 Astro 中间件/端点：Astro 7.0.x 的 dev 服务器交给
 * 中间件和端点的 Request 会丢失查询串和请求体（原始 socket 验证过），
 * 所以这里直接在 Vite connect 层处理原始 node 请求。
 *
 * `apply: "serve"`：只在 pnpm dev 时加载，构建/线上完全不存在；
 * 终端与 API 只响应本机 Host。
 */

const ROOT = resolve(process.cwd());
const POSTS_DIR = join(ROOT, "src", "content", "posts");
const TERMINAL_HTML = join(ROOT, "src", "admin", "terminal.html");

const DEPLOY_COMMAND =
	"pnpm build && npx wrangler deploy --name bjtest2 -c wrangler.jsonc";

const LOG_FILE = join(ROOT, ".admin-log.jsonl");

/** 后台操作日志：所有写操作留痕到项目根 .admin-log.jsonl（仅本地，不入库） */
function appendLog(op, path, detail = "") {
	try {
		writeFileSync(
			LOG_FILE,
			`${JSON.stringify({
				t: new Date().toISOString().slice(0, 19),
				op,
				path,
				detail,
			})}\n`,
			{ flag: "a" },
		);
	} catch {
		/* 日志失败不影响主操作 */
	}
}

function json(res, data, status = 200) {
	res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
	res.end(JSON.stringify(data));
}

function fail(res, message, status = 400) {
	json(res, { error: message }, status);
}

/** slug 只允许字母数字、中文、点横线斜杠，解析后必须落在 posts 目录内 */
function safeSlug(slug) {
	if (typeof slug !== "string") return null;
	const s = slug.trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
	if (!s || s.length > 200) return null;
	if (s.split("/").some((p) => !p || p === "." || p === "..")) return null;
	if (!/^[\w\u4e00-\u9fff./-]+$/.test(s)) return null;
	const resolved = resolve(join(POSTS_DIR, s + ".md"));
	if (resolved !== POSTS_DIR && !resolved.startsWith(POSTS_DIR + sep)) {
		return null;
	}
	return s;
}

function postFile(slug) {
	return join(POSTS_DIR, slug + ".md");
}

function parseFrontmatter(content) {
	const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/.exec(content);
	if (!m) return { data: {}, body: content };
	const data = {};
	for (const line of m[1].split(/\r?\n/)) {
		const kv = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
		if (!kv) continue;
		let v = kv[2].trim();
		if (
			(v.startsWith('"') && v.endsWith('"')) ||
			(v.startsWith("'") && v.endsWith("'"))
		) {
			v = v.slice(1, -1);
		}
		data[kv[1]] = v;
	}
	return { data, body: content.slice(m[0].length) };
}

/** 在 frontmatter 中设置或删除一行（value 为 null 表示删除） */
function updateFrontmatter(content, key, value) {
	const lines = content.split(/\r?\n/);
	if (lines[0]?.trim() !== "---") {
		throw new Error("文章缺少 frontmatter");
	}
	let close = -1;
	for (let i = 1; i < lines.length; i++) {
		if (lines[i].trim() === "---") {
			close = i;
			break;
		}
	}
	if (close === -1) throw new Error("frontmatter 格式不正确");
	const fm = lines.slice(1, close);
	const idx = fm.findIndex((l) => new RegExp(`^${key}:`).test(l));
	if (value === null) {
		if (idx !== -1) fm.splice(idx, 1);
	} else if (idx !== -1) {
		fm[idx] = `${key}: ${value}`;
	} else {
		fm.push(`${key}: ${value}`);
	}
	return ["---", ...fm, "---", ...lines.slice(close + 1)].join("\n");
}

function quote(value) {
	return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function listPosts() {
	const out = [];
	function walk(dir, prefix) {
		for (const name of readdirSync(dir).sort()) {
			const full = join(dir, name);
			const rel = prefix ? `${prefix}/${name}` : name;
			if (statSync(full).isDirectory()) {
				walk(full, rel);
			} else if (name.endsWith(".md") || name.endsWith(".mdx")) {
				const slug = rel.replace(/\.mdx?$/, "");
				try {
					const { data, body } = parseFrontmatter(
						readFileSync(full, "utf-8"),
					);
					out.push({
						slug,
						title: data.title || slug,
						published: data.published || "",
						draft: data.draft === "true",
						encrypted: Boolean(data.password),
						hint: data.passwordHint || "",
						words: Math.round(body.length / 2),
						mtime: statSync(full).mtime.toISOString(),
					});
				} catch {
					/* 读取失败的文章跳过 */
				}
			}
		}
	}
	walk(POSTS_DIR, "");
	return out;
}

function runCommand(command) {
	return new Promise((done) => {
		exec(
			command,
			{
				cwd: ROOT,
				maxBuffer: 32 * 1024 * 1024,
				timeout: 420_000,
				windowsHide: true,
			},
			(err, stdout, stderr) => {
				done({
					code: err ? (typeof err.code === "number" ? err.code : 1) : 0,
					log: `${stdout}\n${stderr}`.trim(),
				});
			},
		);
	});
}

function readBody(req) {
	return new Promise((done, reject) => {
		let size = 0;
		const chunks = [];
		req.on("data", (c) => {
			size += c.length;
			if (size > 4 * 1024 * 1024) {
				reject(new Error("请求体过大"));
				req.destroy();
				return;
			}
			chunks.push(c);
		});
		req.on("end", () => done(Buffer.concat(chunks).toString("utf-8")));
		req.on("error", reject);
	});
}

async function route(req, res, url, pathname) {
	const method = (req.method || "GET").toUpperCase();

	if (pathname === "/admin") {
		res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
		res.end(readFileSync(TERMINAL_HTML));
		return;
	}

	if (pathname === "/admin/api/posts" && method === "GET") {
		json(res, { posts: listPosts() });
		return;
	}

	if (pathname === "/admin/api/post" && method === "GET") {
		const slug = safeSlug(url.searchParams.get("slug"));
		if (!slug) return fail(res, "非法的文章路径");
		const file = postFile(slug);
		if (!existsSync(file)) return fail(res, "文章不存在", 404);
		json(res, { slug, content: readFileSync(file, "utf-8") });
		return;
	}

	if (pathname === "/admin/api/log" && method === "GET") {
		let lines = [];
		if (existsSync(LOG_FILE)) {
			lines = readFileSync(LOG_FILE, "utf-8").trim().split("\n").slice(-50);
		}
		json(res, { lines });
		return;
	}

	if (pathname === "/admin/api/vscode" && method === "POST") {
		const body = JSON.parse((await readBody(req)) || "{}");
		const target = body.slug ? safeSlug(body.slug) : null;
		if (body.slug && !target) return fail(res, "非法的文章路径");
		const openPath = target ? postFile(target) : ROOT;
		const result = await new Promise((done) => {
			exec(
				`code "${openPath}"`,
				{ cwd: ROOT, windowsHide: true, timeout: 15_000 },
				(err) => {
					done(
						err
							? {
									ok: false,
									error: String(err).split("\n")[0].slice(0, 160),
								}
							: { ok: true },
					);
				},
			);
		});
		appendLog("vscode", target || ".", result.ok ? "" : result.error);
		json(res, result);
		return;
	}

	if (method === "POST") {
		const body = JSON.parse((await readBody(req)) || "{}");

		if (pathname === "/admin/api/save") {
			const slug = safeSlug(body.slug);
			if (!slug) return fail(res, "非法的文章路径");
			if (typeof body.content !== "string" || !body.content.trim()) {
				return fail(res, "内容不能为空");
			}
			writeFileSync(postFile(slug), body.content, "utf-8");
			appendLog("write", slug, `${body.content.length} 字符`);
			json(res, { ok: true });
			return;
		}

		if (pathname === "/admin/api/new") {
			let slug = safeSlug(body.slug);
			if (!slug) return fail(res, "路径只能包含字母数字、中文、- _ . /");
			if (!slug.includes("/")) slug = `blog/${slug}`;
			const title =
				typeof body.title === "string" && body.title.trim()
					? body.title.trim()
					: slug;
			const file = postFile(slug);
			if (existsSync(file)) return fail(res, "文章已存在", 409);
			const today = new Date().toISOString().slice(0, 10);
			writeFileSync(
				file,
				`---
title: ${quote(title)}
published: ${today}
description: ""
image: ""
tags: []
category: ""
draft: true
---
`,
				"utf-8",
			);
			json(res, { ok: true, slug });
			appendLog("new", slug, title);
			return;
		}

		if (pathname === "/admin/api/delete") {
			const slug = safeSlug(body.slug);
			if (!slug) return fail(res, "非法的文章路径");
			if (body.confirm !== true) return fail(res, "需要二次确认");
			const file = postFile(slug);
			if (!existsSync(file)) return fail(res, "文章不存在", 404);
			rmSync(file);
			appendLog("delete", slug);
			json(res, { ok: true });
			return;
		}

		if (pathname === "/admin/api/frontmatter") {
			const slug = safeSlug(body.slug);
			const key = body.key;
			const allowed = ["password", "passwordHint", "draft"];
			if (!slug) return fail(res, "非法的文章路径");
			if (typeof key !== "string" || !allowed.includes(key)) {
				return fail(res, "不支持的字段");
			}
			const file = postFile(slug);
			if (!existsSync(file)) return fail(res, "文章不存在", 404);
			const content = readFileSync(file, "utf-8");
			let value = null;
			if (key === "draft") {
				value =
					body.value === true || body.value === "true" ? "true" : "false";
			} else if (body.clear === true) {
				value = null;
			} else {
				if (typeof body.value !== "string" || !body.value) {
					return fail(res, "值不能为空");
				}
				value = quote(body.value);
			}
			writeFileSync(file, updateFrontmatter(content, key, value), "utf-8");
			appendLog(
				"frontmatter",
				slug,
				key === "password"
					? value === null
						? "password=(已清除)"
						: "password=(已设置)"
					: `${key}=${value}`,
			);
			json(res, { ok: true });
			return;
		}

		if (pathname === "/admin/api/run") {
			const command =
				body.cmd === "build"
					? "pnpm build"
					: body.cmd === "deploy"
						? DEPLOY_COMMAND
						: null;
			if (!command) return fail(res, "不支持的命令");
			const result = await runCommand(command);
			appendLog(`run:${body.cmd}`, "", `exit=${result.code}`);
			json(res, result);
			return;
		}
	}

	fail(res, "not found", 404);
}

export function adminDevPlugin() {
	return {
		name: "firefly-admin-terminal",
		apply: "serve",
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				try {
					const url = new URL(req.url || "/", "http://localhost");
					const pathname = url.pathname.replace(/\/+$/, "") || "/";
					if (
						pathname !== "/admin" &&
						!pathname.startsWith("/admin/api/")
					) {
						return next();
					}
					// 仅允许本机访问，防止 dev server 暴露到局域网
					const host = String(req.headers.host || "")
						.split(":")[0]
						.toLowerCase();
					if (
						!["localhost", "127.0.0.1", "[::1]", "::1"].includes(host)
					) {
						return next();
					}
					await route(req, res, url, pathname);
				} catch (err) {
					if (!res.headersSent) {
						fail(
							res,
							err instanceof Error ? err.message : String(err),
							500,
						);
					}
				}
			});
		},
	};
}
