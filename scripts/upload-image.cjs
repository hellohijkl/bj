// Usage: node scripts/upload-image.cjs <image-path> [more paths...]
// Converts images to WebP, saves them to public/images/blog/,
// and prints the markdown reference for each one.
const sharp = require("sharp");
const fs = require("node:fs");
const path = require("node:path");

const MAX_WIDTH = 1600;
const QUALITY = 82;

async function processOne(srcPath, stampSeq) {
	if (!fs.existsSync(srcPath)) {
		console.error(`File not found: ${srcPath}`);
		return;
	}

	const root = path.resolve(__dirname, "..");
	const outDir = path.join(root, "public", "images", "blog");
	fs.mkdirSync(outDir, { recursive: true });

	const base = path
		.basename(srcPath)
		.replace(/\.[^.]+$/, "")
		.replace(/[^\w\u4e00-\u9fa5.-]/g, "_");
	if (!base || base === ".") {
		console.error(`Cannot derive a name from: ${srcPath}`);
		return;
	}

	const stamp = `${Date.now()}${String(stampSeq).padStart(3, "0")}`;
	const outName = `${stamp}_${base}.webp`;
	const dest = path.join(outDir, outName);

	await sharp(srcPath)
		.rotate()
		.resize({ width: MAX_WIDTH, withoutEnlargement: true })
		.webp({ quality: QUALITY, effort: 5 })
		.toFile(dest);

	const srcKb = (fs.statSync(srcPath).size / 1024).toFixed(0);
	const outKb = (fs.statSync(dest).size / 1024).toFixed(0);
	console.log(`OK  ${srcPath}  (${srcKb} KB -> ${outKb} KB webp)`);
	console.log(`![${base}](/images/blog/${outName})`);
}

async function main() {
	const args = process.argv.slice(2);
	const paths = args.filter((a) => fs.existsSync(a));
	if (paths.length === 0) {
		console.log("Usage: node scripts/upload-image.cjs <image-path> [more paths...]");
		console.log("       pnpm img <image-path> [more paths...]");
		process.exit(1);
	}
	for (let i = 0; i < paths.length; i++) {
		await processOne(paths[i], i);
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
