// scripts/fetch-content.js

import fs from 'node:fs/promises'
import path from 'node:path'
import 'dotenv/config'
import { extractFooter, extractErrorPage, extractHomePage } from './extractors.js'

const STRAPI_BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337'

const LOCALES = ['en', 'fr', 'es']
const ROUTES = ['homepage', 'footer', 'error-page']

const ROUTE_MAP = {
  footer: extractFooter,
  homepage: extractHomePage,
  'error-page': extractErrorPage,
}

function routeToKey(route) {
  if (route === 'homepage') return 'home_page'
  if (route === 'error-page') return 'error_page'
  return route
}

const CONTENT_DIR = path.resolve('i18n/locales/content')

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

function buildUrl(route, locale) {
  return `${STRAPI_BASE_URL}/api/${route}?locale=${locale}&populate=*`
}

async function fetchJson(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`)
  }

  return response.json()
}

async function main() {
  await ensureDir(CONTENT_DIR)

  for (const locale of LOCALES) {
    const localeContent = {}

    for (const route of ROUTES) {
      const url = buildUrl(route, locale)

      console.log(`Fetching ${url}`)

      const json = await fetchJson(url)

      const extractor = ROUTE_MAP[route]
      if (!extractor) throw new Error(`No extractor for route: ${route}`)

      const key = routeToKey(route)

      localeContent[key] = extractor(json.data)
    }

    const outputPath = path.join(CONTENT_DIR, `${locale}.json`)

    await fs.writeFile(outputPath, JSON.stringify(localeContent, null, 2), 'utf-8')

    console.log(`Saved ${outputPath}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
