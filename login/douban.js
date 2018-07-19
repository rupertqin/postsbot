'use strict'

const puppeteer = require('puppeteer')
const readline = require('readline');
const config = require('../config/config.default')
const { auth: doubanAuth, posts } = config.douban

;(async () => {
  const browser = await puppeteer.launch({
     headless: false,
     args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  let page = await browser.newPage()
  page.setDefaultNavigationTimeout(15*1000)
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36')
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('https://accounts.douban.com', { waitUntil: 'networkidle0' })

  
  // fill form
  await page.type('#email', doubanAuth.email)
  await page.type('#password', doubanAuth.password)
  
  // get captcha
  const captcha = await page.evaluate(() => document.querySelectorAll('.item-captcha') )
  if (Object.keys(captcha).length) {
    await page.screenshot({ path: 'douban-login.png', fullPage: true })
    const captchaCode = await readCaptcha()
    console.log('captcha is : ', captchaCode)
    await page.type('#captcha_field', captchaCode)
  }

  await page.click('.btn-submit')

  if (posts.length) {
    for (const post of posts) {
      await timeout(3000)
      await reply_post(page, post)
    }
  }


  // browser.close()
})()

function timeout(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function reply_post(page, link) {
  await page.goto(link, { waitUntil: 'networkidle0' })
  await page.type('#last', 'UP')
  await page.click('.js-verify-account')
  await page.waitForNavigation()
}

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
