#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Buffer } = require('buffer');

const ROOT_DIR = path.resolve(__dirname, '..');
const PET_ASSET_DIR = path.join(ROOT_DIR, 'src', 'assets', 'pet');
const SKIP_DIRS = new Set(['origin', 'fx']);
const VALID_DIRECTIONS = new Set([
  'none',
  'left',
  'right',
  'up',
  'down',
  'leftUp',
  'leftDown',
  'rightUp',
  'rightDown',
]);

const errors = [];
const scannedFiles = [];

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const absolutePath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(absolutePath);
      continue;
    }

    if (!entry.isFile()) continue;
    if (!entry.name.toLowerCase().endsWith('.png')) continue;
    scannedFiles.push(absolutePath);
  }
}

function parsePngSize(filePath) {
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(24);

  try {
    const bytesRead = fs.readSync(fd, buffer, 0, 24, 0);
    if (bytesRead < 24) {
      throw new Error('file is too small to be a valid PNG');
    }

    const pngSignature = '89504e470d0a1a0a';
    if (buffer.subarray(0, 8).toString('hex') !== pngSignature) {
      throw new Error('invalid PNG signature');
    }

    const chunkType = buffer.subarray(12, 16).toString('ascii');
    if (chunkType !== 'IHDR') {
      throw new Error('missing IHDR chunk');
    }

    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  } finally {
    fs.closeSync(fd);
  }
}

function validateFilename(filePath) {
  const baseName = path.basename(filePath, '.png');
  const tokens = baseName.split('_');

  if (tokens.length < 5) {
    errors.push(
      `${filePath}: invalid filename format. Expected {pet}_{version}_{zIndex}_{part}_{direction}.png (if no direction, use _none).`
    );
    return;
  }

  const pet = tokens[0];
  const version = tokens[1];
  const zIndex = tokens[2];
  const part = tokens.slice(3, -1).join('_');
  const direction = tokens[tokens.length - 1];

  if (!/^[a-z0-9]+$/.test(pet)) {
    errors.push(
      `${filePath}: invalid pet token "${pet}". Use lowercase letters/numbers only.`
    );
  }

  if (!/^v\d+$/.test(version)) {
    errors.push(
      `${filePath}: invalid version "${version}". Use format like v1.`
    );
  }

  if (!/^\d{2}$/.test(zIndex)) {
    errors.push(
      `${filePath}: invalid zIndex "${zIndex}". Use 2-digit format like 00, 07, 11.`
    );
  }

  if (!part || !/^[A-Za-z0-9_]+$/.test(part)) {
    errors.push(
      `${filePath}: invalid part token "${part}". Use letters/numbers/_ only.`
    );
  }

  if (!VALID_DIRECTIONS.has(direction)) {
    errors.push(
      `${filePath}: invalid direction "${direction}". Allowed: ${Array.from(
        VALID_DIRECTIONS
      ).join(', ')}. If no direction, use "none".`
    );
  }
}

function validateSize(filePath) {
  try {
    const { width, height } = parsePngSize(filePath);
    if (width !== 1024 || height !== 1024) {
      errors.push(
        `${filePath}: expected 1024x1024 PNG, found ${width}x${height}.`
      );
    }
  } catch (error) {
    errors.push(`${filePath}: PNG read error (${error.message}).`);
  }
}

function main() {
  if (!fs.existsSync(PET_ASSET_DIR)) {
    console.error(`Pet asset directory not found: ${PET_ASSET_DIR}`);
    process.exit(1);
  }

  walk(PET_ASSET_DIR);

  if (scannedFiles.length === 0) {
    console.error(`No PNG files found under: ${PET_ASSET_DIR}`);
    process.exit(1);
  }

  for (const filePath of scannedFiles) {
    validateFilename(filePath);
    validateSize(filePath);
  }

  if (errors.length > 0) {
    console.error(
      `Pet asset validation failed with ${errors.length} issue(s):`
    );
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(
    `Pet asset validation passed (${scannedFiles.length} PNG files checked).`
  );
}

main();
