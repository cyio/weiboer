const puppeteer = require('puppeteer');
const login = require('./service/login');
const publisher = require('./service/publish');
const nconf = require('nconf');
const path = require('path');
const chromeConfig = {
  // headless: false,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
}

function init(pathToConfig) {
  nconf.argv()
  .env();
  if (pathToConfig) {
    nconf.file(pathToConfig);
  }
  return {
    publish: (...args) => {return publish(...args)}
  }
}

/**
 * 
 * @param {String} text 
 * @param {Array<String>} pictures pictures to publish
 */
async function publish(text, pictures) {
  const browser = await puppeteer.launch(chromeConfig);
  const page = await browser.newPage();
  await page.setViewport({
    width: 1000,
    height: 1080,
    deviceScaleFactor: 1
  });
  await page.setRequestInterception(true);
  page.on('request', req => {
    const whitelist = ['document', 'script', 'xhr', 'fetch', 'image', 'stylesheet'];
    if (!whitelist.includes(req.resourceType())) {
      return req.abort();
    }
    req.continue();
  });
  try {
    console.log('开始登陆...');
    await login(page);
  } catch (e) {
    console.log(e);
    throw new Error('登录失败！');
  }

  try {
    console.log('开始发送...');
    await publisher(page, text, pictures);
    console.log('发送成功！');
  } catch (e) {
    console.log(e);
    throw new Error('发布失败！');
  }
  await page.close();
  await browser.close();
}

module.exports = {
  init: init
}
