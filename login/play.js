'use strict'

const puppeteer = require('puppeteer')
const readline = require('readline');
const config = require('../config/config.default')


;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: config.executablePath,
  })
  let page = await browser.newPage()
  page.setDefaultNavigationTimeout(15*1000)
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36')
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('http://localhost:8000/')
  const $normals = await page.$$('.normal')
  $normals.map(async $normal => {
    const text = await $normal.$eval('h1', n => n.textContent)
    console.log(text)
    await $normal.click()
  })
  console.log('before accepted')
  page.on('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.accept()
    console.log('accepted')
  })
})();

function timeout(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

