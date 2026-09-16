#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outDir = path.join(root, 'deploy')
const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
const zipName = `apprebrands-deploy-${stamp}.zip`
const zipPath = path.join(outDir, zipName)

fs.mkdirSync(outDir, { recursive: true })

const distDir = path.join(root, 'dist')
if (!fs.existsSync(distDir)) {
  console.error('dist/ missing. Run npm run build first.')
  process.exit(1)
}

const staging = path.join(outDir, 'staging')
fs.rmSync(staging, { recursive: true, force: true })
fs.mkdirSync(staging, { recursive: true })

function copy(src, dest) {
  fs.cpSync(src, dest, { recursive: true })
}

copy(path.join(root, 'dist'), path.join(staging, 'dist'))
copy(path.join(root, 'server'), path.join(staging, 'server'))
fs.mkdirSync(path.join(staging, 'data'), { recursive: true })
fs.writeFileSync(path.join(staging, 'data', '.gitkeep'), '')
copy(path.join(root, 'package.json'), path.join(staging, 'package.json'))
copy(path.join(root, 'package-lock.json'), path.join(staging, 'package-lock.json'))
if (fs.existsSync(path.join(root, '.env.example'))) {
  copy(path.join(root, '.env.example'), path.join(staging, '.env.example'))
}
if (fs.existsSync(path.join(root, 'README.md'))) {
  copy(path.join(root, 'README.md'), path.join(staging, 'README.md'))
}

// Production package.json: ensure start script works; omit vite from required runtime
const pkg = JSON.parse(fs.readFileSync(path.join(staging, 'package.json'), 'utf8'))
pkg.scripts = {
  start: 'NODE_ENV=production node server/index.js',
}
delete pkg.devDependencies
fs.writeFileSync(path.join(staging, 'package.json'), JSON.stringify(pkg, null, 2))

if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath)
execSync(`cd "${staging}" && zip -r "${zipPath}" .`, { stdio: 'inherit' })
fs.rmSync(staging, { recursive: true, force: true })

console.log(`Created ${zipPath}`)
