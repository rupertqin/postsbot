'use strict'

const puppeteer = require('puppeteer')
const readline = require('readline');
const config = require('../config/config.default')
const { auth: doubanAuth, postIds, postPreUrl, REPLIES } = config.douban


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
  await page.goto('https://accounts.douban.com')

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

  if (postIds.length) {
    for (const postId of postIds) {
      await timeout(3000)
      const url = `${postPreUrl}/${postId}`
      await del_my_garbage(page, url)
      // await reply_post(page, url)
    }
  }


  // browser.close()
})()

function timeout(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function del_my_garbage(page, link) {
  await page.goto(link)
  let $comments = await page.$$('.comment-item')
  page.on('dialog', async dialog => {
    await dialog.accept();
  })
  for (const $comment of $comments) {
    const text = await $comment.$eval('.operation_div', n => {
      return n.previousElementSibling.textContent
    })
    console.log('text:', text)
    if (!REPLIES.includes(text)) {
      // last one
      if ($comments.indexOf($comment) === $comments.length) {
        return false
      }
      continue;
    }
    const $del = await $comment.$('.lnk-delete-comment')
    await $comment.hover()
    await $del.click()
    await timeout(2000)
    return del_my_garbage(page, link)
  }
}

async function reply_post(page, link) {
  await page.goto(link)
  await del_my_garbage(page)
  await page.type('#last', 'UP')
  await page.click('.js-verify-account input')
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
