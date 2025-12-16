#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCREENSHOTS_DIR = join(__dirname, '..', 'public', 'images', 'screenshots');
const APP_URL = 'http://localhost:8080';

const screenshots = [
  { name: 'navigation/sidebar', url: `${APP_URL}/`, wait: 3000 },
  { name: 'copilot/overview', url: `${APP_URL}/`, wait: 3000 },
  { name: 'brand-hub/overview', url: `${APP_URL}/brand`, wait: 3000 },
  { name: 'competitive/overview', url: `${APP_URL}/competitive`, wait: 3000 },
  { name: 'industry-lens/overview', url: `${APP_URL}/industry`, wait: 3000 },
  { name: 'content-studio/overview', url: `${APP_URL}/create`, wait: 3000 },
  { name: 'reports/overview', url: `${APP_URL}/reports`, wait: 3000 },
];

async function main() {
  console.log('📸 Taking screenshots...\n');
  const browser = await chromium.launch({ headless: true });
  
  for (const { name, url, wait } of screenshots) {
    const [dir, file] = name.split('/');
    const dirPath = join(SCREENSHOTS_DIR, dir);
    if (!existsSync(dirPath)) await mkdir(dirPath, { recursive: true });
    
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(wait);
    await page.screenshot({ path: join(dirPath, `${file}.png`), fullPage: true });
    await page.close();
    console.log(`✅ ${name}`);
  }
  
  await browser.close();
  console.log('\n✨ Done!');
}

main().catch(console.error);
