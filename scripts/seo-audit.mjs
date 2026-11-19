#!/usr/bin/env node
/**
 * Automated Technical SEO Audit for static Next.js export (out/)
 * Zero external dependencies. Exits with code 1 on any confirmed SEO defect.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.join(PROJECT_DIR, 'out');
const SITE_URL = 'https://tuthien.gaosoctrang.com';
const BRAND_NAME = 'Vựa Gạo Sóc Trăng';

const errors = [];
const warnings = [];

function fail(scope, msg) {
  errors.push(`[ERROR] ${scope}: ${msg}`);
}

function warn(scope, msg) {
  warnings.push(`[WARN]  ${scope}: ${msg}`);
}

function walkHtmlFiles(dir, rel = '') {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relPath = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (entry.name === '_next' || entry.name === '.git') continue;
      results.push(...walkHtmlFiles(fullPath, relPath));
    } else if (entry.name.endsWith('.html')) {
      results.push({ fullPath, relPath });
    }
  }
  return results;
}

function relHtmlToRoute(relPath) {
  if (relPath === 'index.html') return '/';
  if (relPath.endsWith('/index.html')) {
    return `/${relPath.slice(0, -'index.html'.length)}`;
  }
  return `/${relPath}`;
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function stripTags(str) {
  return decodeHtmlEntities(str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function extractAttr(tag, attrName) {
  const re = new RegExp(`\\b${attrName}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i');
  const m = tag.match(re);
  return m ? decodeHtmlEntities(m[1] ?? m[2] ?? '') : null;
}

if (!fs.existsSync(OUT_DIR)) {
  console.error('❌ Không tìm thấy thư mục out/. Hãy chạy `npm run build` trước.');
  process.exit(1);
}

// 1. Parse sitemap.xml
const sitemapPath = path.join(OUT_DIR, 'sitemap.xml');
const sitemapRoutes = new Set();
if (!fs.existsSync(sitemapPath)) {
  fail('sitemap.xml', 'Thiếu file out/sitemap.xml');
} else {
  const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
  const locMatches = [...sitemapXml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)];
  if (locMatches.length === 0) {
    fail('sitemap.xml', 'Không tìm thấy thẻ <loc> hợp lệ trong sitemap.xml');
  }
  for (const m of locMatches) {
    const loc = m[1];
    if (!loc.startsWith(`${SITE_URL}/`)) {
      fail('sitemap.xml', `URL không dùng domain chính tắc (${SITE_URL}/): ${loc}`);
      continue;
    }
    const route = loc.slice(SITE_URL.length);
    if (!route.endsWith('/')) {
      fail('sitemap.xml', `URL thiếu dấu "/" cuối: ${loc}`);
    }
    sitemapRoutes.add(route);
  }
}

// 2. Discover built HTML pages (excluding Next.js 404/_not-found)
const IGNORED_HTML = new Set(['404.html', '404/index.html', '_not-found.html', '_not-found/index.html']);
const htmlFiles = walkHtmlFiles(OUT_DIR).filter((f) => !IGNORED_HTML.has(f.relPath));
const builtRoutes = new Map();

for (const file of htmlFiles) {
  const route = relHtmlToRoute(file.relPath);
  builtRoutes.set(route, file.fullPath);
}

// 3. Cross-check built routes <-> sitemap.xml
for (const route of builtRoutes.keys()) {
  if (!sitemapRoutes.has(route)) {
    fail(route, 'Trang có trong bản build out/ nhưng KHÔNG có trong sitemap.xml (nguy cơ route trùng/alias hoặc quên khai báo sitemap)');
  }
}
for (const route of sitemapRoutes) {
  if (!builtRoutes.has(route)) {
    fail(route, 'URL có trong sitemap.xml nhưng không tồn tại file HTML trong out/');
  }
}

// 4. Audit every built HTML page
const seenTitles = new Map();
const seenDescs = new Map();

for (const [route, fullPath] of builtRoutes.entries()) {
  const html = fs.readFileSync(fullPath, 'utf8');
  const expectedCanonical = `${SITE_URL}${route}`;

  // lang="vi"
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] || '';
  if (extractAttr(htmlTag, 'lang') !== 'vi') {
    fail(route, 'Thiếu hoặc sai thuộc tính lang="vi" trên thẻ <html>');
  }

  // viewport
  const hasViewport = /<meta\b[^>]*name=["']viewport["'][^>]*>/i.test(html);
  if (!hasViewport) {
    fail(route, 'Thiếu thẻ <meta name="viewport">');
  }

  // title
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleMatch) {
    fail(route, 'Thiếu thẻ <title>');
  } else {
    const title = decodeHtmlEntities(titleMatch[1].replace(/\s+/g, ' ').trim());
    if (!title) {
      fail(route, 'Thẻ <title> rỗng');
    } else {
      const brandOccurrences = title.split(BRAND_NAME).length - 1;
      if (brandOccurrences > 1) {
        fail(route, `<title> bị lặp tên thương hiệu "${BRAND_NAME}" ${brandOccurrences} lần: "${title}"`);
      }
      if (seenTitles.has(title)) {
        fail(route, `Trùng <title> với trang ${seenTitles.get(title)}: "${title}"`);
      } else {
        seenTitles.set(title, route);
      }
      if (title.length > 65) {
        warn(route, `<title> dài ${title.length} ký tự (khuyến nghị ≤ 60-65c): "${title}"`);
      }
    }
  }

  // meta description
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  let desc = null;
  let robots = null;
  for (const tag of metaTags) {
    const name = (extractAttr(tag, 'name') || '').toLowerCase();
    if (name === 'description') desc = extractAttr(tag, 'content');
    if (name === 'robots') robots = extractAttr(tag, 'content');
  }
  if (!desc || !desc.trim()) {
    fail(route, 'Thiếu <meta name="description">');
  } else {
    if (seenDescs.has(desc)) {
      fail(route, `Trùng meta description với trang ${seenDescs.get(desc)}`);
    } else {
      seenDescs.set(desc, route);
    }
    if (desc.length > 160) {
      warn(route, `Meta description dài ${desc.length} ký tự (khuyến nghị ≤ 155-160c)`);
    }
  }
  if (robots && /noindex/i.test(robots)) {
    fail(route, `Trang chính tắc bị gắn noindex: robots="${robots}"`);
  }

  // canonical
  const linkTags = html.match(/<link\b[^>]*>/gi) || [];
  const canonicals = [];
  for (const tag of linkTags) {
    const rel = (extractAttr(tag, 'rel') || '').toLowerCase().split(/\s+/);
    if (rel.includes('canonical')) {
      canonicals.push(extractAttr(tag, 'href'));
    }
  }
  if (canonicals.length !== 1) {
    fail(route, `Cần đúng 1 thẻ canonical, hiện có ${canonicals.length}`);
  } else if (canonicals[0] !== expectedCanonical) {
    fail(route, `Canonical không khớp URL trang: thực tế="${canonicals[0]}", mong đợi="${expectedCanonical}"`);
  }

  // H1
  const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1Matches.length !== 1) {
    fail(route, `Cần đúng 1 thẻ <h1>, hiện có ${h1Matches.length}`);
  } else if (!stripTags(h1Matches[0][1])) {
    fail(route, 'Thẻ <h1> rỗng');
  }

  // JSON-LD syntax
  const jsonLdMatches = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (let i = 0; i < jsonLdMatches.length; i++) {
    try {
      JSON.parse(jsonLdMatches[i][1]);
    } catch (err) {
      fail(route, `JSON-LD block #${i + 1} lỗi cú pháp: ${err.message}`);
    }
  }

  // Images: alt + local file exists
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  for (const tag of imgTags) {
    const src = extractAttr(tag, 'src') || '';
    const alt = extractAttr(tag, 'alt');
    if (alt === null) {
      fail(route, `Thẻ <img> thiếu thuộc tính alt: src="${src}"`);
    }
    if (src.startsWith('/') && !src.startsWith('//')) {
      const cleanSrc = decodeURIComponent(src.split('?')[0].split('#')[0]);
      const assetPath = path.join(OUT_DIR, cleanSrc.slice(1));
      if (!fs.existsSync(assetPath)) {
        fail(route, `Ảnh không tồn tại trong out/: ${src}`);
      }
    }
  }

  // Internal links: must resolve directly to an existing page or file in out/
  const aTags = html.match(/<a\b[^>]*>/gi) || [];
  for (const tag of aTags) {
    const href = extractAttr(tag, 'href');
    if (!href || !href.startsWith('/') || href.startsWith('//')) continue;
    const cleanPath = href.split('#')[0].split('?')[0];
    if (!cleanPath) continue;
    if (builtRoutes.has(cleanPath)) continue;
    const staticFile = path.join(OUT_DIR, cleanPath.slice(1));
    if (fs.existsSync(staticFile) && fs.statSync(staticFile).isFile()) continue;
    fail(route, `Link nội bộ trỏ sai hoặc qua redirect (không khớp route/file trong out/): href="${href}"`);
  }
}

// 5. Audit .htaccess (LiteSpeed safety + www redirect)
const htaccessPath = path.join(OUT_DIR, '.htaccess');
if (!fs.existsSync(htaccessPath)) {
  fail('.htaccess', 'Thiếu file out/.htaccess');
} else {
  const ht = fs.readFileSync(htaccessPath, 'utf8');
  if (!/www\\\.tuthien\\\.gaosoctrang\\\.com/i.test(ht)) {
    fail('.htaccess', 'Thiếu rule chuyển hướng 301 cho www.tuthien.gaosoctrang.com');
  }
  const headerLines = ht.split('\n').filter((l) => /^\s*Header\s+/i.test(l));
  for (const line of headerLines) {
    if (line.includes('\\"')) {
      fail('.htaccess', `Lỗi escape \\" trong chỉ thị Header trên LiteSpeed (hãy bọc bằng nháy đơn '...'): ${line.trim()}`);
    }
  }
}

// Summary
console.log(`🔎 SEO Audit hoàn tất trên ${builtRoutes.size} trang tĩnh trong out/`);
if (warnings.length > 0) {
  console.log(`\n⚠️  Cảnh báo (${warnings.length}):`);
  for (const w of warnings) console.log(`  ${w}`);
}
if (errors.length > 0) {
  console.error(`\n❌ Phát hiện ${errors.length} lỗi Technical SEO (chặn deploy):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

console.log('✅ Pass 100% kiểm tra Technical SEO (0 lỗi).');
