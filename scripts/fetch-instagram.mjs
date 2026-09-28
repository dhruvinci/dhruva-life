#!/usr/bin/env node
// Pull recent posts from Instagram accounts via Apify and download their images
// into .notes/instagram/ (gitignored) so good stills can be picked for /camera.
//
//   APIFY_TOKEN=... node scripts/fetch-instagram.mjs dhrude dhrujitsu
//
// The token is read from the environment only; it is never written anywhere.

import fs from "node:fs"
import path from "node:path"

const token = process.env.APIFY_TOKEN
const accounts = process.argv.slice(2)
const limit = Number(process.env.LIMIT ?? 40)

if (!token || accounts.length === 0) {
  console.error("Usage: APIFY_TOKEN=... node scripts/fetch-instagram.mjs <account> [account...]")
  process.exit(1)
}

const outDir = path.join(process.cwd(), ".notes", "instagram")
const rawDir = path.join(outDir, "raw")
fs.mkdirSync(rawDir, { recursive: true })

console.log(`Fetching up to ${limit} posts each from: ${accounts.join(", ")} (this can take a minute or two)...`)
const response = await fetch(
  `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      directUrls: accounts.map((account) => `https://www.instagram.com/${account}/`),
      resultsType: "posts",
      resultsLimit: limit,
      addParentData: false,
    }),
  },
)
if (!response.ok) {
  console.error(`Apify request failed: ${response.status} ${response.statusText}`)
  process.exit(1)
}

const posts = await response.json()
// Keep only what we need; no tokens or signed URLs are stored beyond the download.
const summary = []
let downloaded = 0

// Photos only: skip videos and reels (including their cover frames).
function photoUrls(post) {
  if (post.type === "Video" || post.productType === "clips") return []
  if (post.type === "Sidecar") {
    const children = post.childPosts ?? []
    if (children.length) return children.filter((child) => child.type === "Image" && child.displayUrl).map((child) => child.displayUrl)
    return post.images ?? []
  }
  return post.displayUrl ? [post.displayUrl] : []
}

let skipped = 0
for (const post of posts) {
  const account = post.ownerUsername ?? "unknown"
  const urls = photoUrls(post)
  if (urls.length === 0) {
    skipped++
    continue
  }
  const files = []
  for (const [index, url] of urls.entries()) {
    const file = `${account}-${post.shortCode}-${index}.jpg`
    try {
      const image = await fetch(url)
      if (!image.ok) continue
      fs.writeFileSync(path.join(rawDir, file), Buffer.from(await image.arrayBuffer()))
      files.push(file)
      downloaded++
    } catch {
      // Skip images that fail to download.
    }
  }
  summary.push({
    account,
    shortCode: post.shortCode,
    type: post.type,
    date: post.timestamp?.slice(0, 10),
    caption: (post.caption ?? "").slice(0, 280),
    files,
  })
}

fs.writeFileSync(path.join(outDir, "posts.json"), JSON.stringify(summary, null, 2))
console.log(`Done: ${summary.length} photo posts, ${downloaded} images in .notes/instagram/raw/ (${skipped} videos/reels skipped)`)
