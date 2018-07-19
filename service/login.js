const nconf = require('nconf');
const puppeteer = require('puppeteer');
async function login (page) {
  const username = nconf.get('username');
  const password = nconf.get('password');
  await page.setUserAgent('Mozilla/5.0(Macintosh;U;IntelMacOSX10_6_8;en-us)AppleWebKit/534.50(KHTML,likeGecko)Version/5.1Safari/534.50');
  await page.goto('https://passport.weibo.cn/signin/login?entry=mweibo&res=wel&wm=3349&r=https%3A%2F%2Fm.weibo.cn%2Fbeta');
  await page.waitForSelector('#loginName', {visible: true});
  await page.click('#loginName');
  await page.focus('#loginName');
  await page.type('#loginName', username);
  await page.type('#loginPassword', password);
  await page.click('#loginAction');
  return page.waitForSelector('.lite-iconf-profile', 20000);
}

module.exports = login;

