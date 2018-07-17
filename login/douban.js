'use strict'

const puppeteer = require('puppeteer')
const readline = require('readline');
const config = require('../config/config.default')
const doubanAuth = config.douban.auth

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function readCaptcha() {
  return new Promise((resolve, reject) => {
    rl.question('captcha ?', (answer) => {
      resolve(answer)
    });
  })
}

;(async () => {
  const browser = await puppeteer.launch({
     // headless: false,
     args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  let page = await browser.newPage()
  page.setDefaultNavigationTimeout(15*1000)
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36')
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('https://accounts.douban.com')

  // get captcha
  await page.screenshot({ path: 'douban-login.png', fullPage: true })
  const captchaCode = await readCaptcha()
  console.log('captcha is : ', captchaCode)

  // fill form
  await page.type('#email', doubanAuth.email)
  await page.type('#password', doubanAuth.password)
  await page.click('.btn-submit')
  await page.waitForNavigation()
  await page.screenshot({ path: 'douban-logined.png', fullPage: true })
  browser.close()
})()

