'use strict'

const puppeteer = require('puppeteer')
const readline = require('readline');
const config = require('../config/config.default')
let { auth: tiebaAuth, posts, page: pageNum, headless } = config.tieba

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const msgList = [
  '可以私聊',
  '喜欢的可以私聊我',
  '看上的可以私我',
  '可以私我',
  '可以私我哦',
]


;(async () => {
  const browser = await puppeteer.launch({
     headless,
     args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  let page = await browser.newPage()
  page.setDefaultNavigationTimeout(15 * 1000)
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36')
  await page.setViewport({ width: 1480, height: 1000 })
  await page.goto('https://tieba.baidu.com/index.html', {waitUntil: 'networkidle0'})
  const ssss = await page.evaluate(() => document.querySelector('.notessss') )
  console.log(ssss)
  await page.click('.u_login')
  await timeout(3000)
  await page.click('.tang-pass-footerBarULogin')
  console.log('after click to form')

  // fill form
  await page.type('#TANGRAM__PSP_10__userName', tiebaAuth.user)
  await page.type('#TANGRAM__PSP_10__password', tiebaAuth.password)
  await page.screenshot({ path: 'tieba-login.png', fullPage: true })
  await page.click('.pass-button-submit')
  console.log('after click submit')
  await page.waitForNavigation()
  if (!headless) {
  }

  // get captcha
  await timeout(2000)
  console.log('before evaluate')
  const securityBox = await page.evaluate(() => document.querySelector('.pass-forceverify-wrapper') )
  console.log(`securityBox: ${securityBox}`)
  if (securityBox) {
    console.log(await page.evaluate(() => document.querySelectorAll('.pass-forceverify-wrapper').innerText ))
    await page.waitForSelector('#TANGRAM__25__content_send_mobile')
    await page.click('#TANGRAM__25__content_send_mobile')
    const captchaCode = await readCaptcha()
    console.log('captcha is : ', captchaCode)
    await page.type('.forceverify-input', captchaCode)
    await page.click('#TANGRAM__25__content_submit')
    await page.waitForNavigation()
  }


  if (!(posts && posts.length)) {
    await page.goto(`http://tieba.baidu.com/i/i/my_tie?&pn=${pageNum}`)
    posts = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.simple_block_container ul li .wrap a.thread_title'))
      return anchors.map(anchor => anchor.href)
    })
    console.log(posts)
  }

  for (const p of posts) {
    await reply_post(page, p)
    console.log(p)
    await timeout(2*60*1000)
  }

  // browser.close()
  // process.exit(0)
})()

function timeout(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function reply_post(page, link) {
  const msg = msgList[Math.floor(Math.random() * msgList.length)]
  await page.goto(link, {waitUntil: 'networkidle2'})
  await page.keyboard.press('End');
  await timeout(1000)
  await page.type('#ueditor_replace', msg)
  await page.click('.poster_submit')
  // await page.waitForNavigation()
}


function readCaptcha() {
  return new Promise((resolve, reject) => {
    rl.question('captcha ?', (answer) => {
      resolve(answer)
    });
  })
}

