'use strict'

const puppeteer = require('puppeteer')
const readline = require('readline');
const config = require('../config/config.default')
const tiebaAuth = config.tieba.auth

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
     headless: false,
     args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  let page = await browser.newPage()
  page.setDefaultNavigationTimeout(15 * 1000)
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36')
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('https://tieba.baidu.com/index.html')
  await page.click('.u_login')
  await timeout(3000)
  await page.click('.tang-pass-footerBarULogin')

  // get captcha
  // await page.screenshot({ path: 'tieba-login.png', fullPage: true })
  // const captchaCode = await readCaptcha()
  // console.log('captcha is : ', captchaCode)

  // fill form
  await page.type('#TANGRAM__PSP_10__userName', tiebaAuth.user)
  await page.type('#TANGRAM__PSP_10__password', tiebaAuth.password)
  await page.screenshot({ path: 'tieba-login.png', fullPage: true })
  await page.click('.pass-button-submit')
  await page.waitForNavigation()


  await page.goto('http://tieba.baidu.com/i/i/my_tie')
  let links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('.simple_block_container ul li .wrap a.thread_title'))
    return anchors.map(anchor => anchor.href)
  })
  console.log(links)

  links = links.slice(5,10)
  for (const link of links) {
    console.log(link)
    await timeout(5000)
    await reply_post(page, link)
  }


  await page.screenshot({ path: 'tieba-logined.png', fullPage: true })
  // browser.close()
  // process.exit(0)
})()

function timeout(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function reply_post(page, link) {
  await page.goto(link)
  await page.type('#ueditor_replace', '可以私聊')
  await page.click('.poster_submit')
  // await page.waitForNavigation()
}


