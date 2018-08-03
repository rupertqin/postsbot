'use strict'

const puppeteer = require('puppeteer')


;(async () => {
  const browser = await puppeteer.launch({
     headless: true,
     args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  let page = await browser.newPage()
  page.setDefaultNavigationTimeout(15 * 1000)
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36')
  await page.setViewport({ width: 1480, height: 1000 })
  await page.goto('https://tieba.baidu.com/index.html', {waitUntil: 'networkidle2'})
  const securityBox = await page.evaluate(() => document.querySelector('.notessss') )
  console.log(securityBox)

  // await page.keyboard.press('End');
  // await timeout(1000)
  // await page.type('#ueditor_replace', '可以私聊a')
  // await timeout(5 * 1000)
  // await page.screenshot({ path: 'tieba-login.png', fullPage: true })

})()

function timeout(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}




