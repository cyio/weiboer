const nconf = require('nconf');
const puppeteer = require('puppeteer');
const delay = require('../utils/delay');
function* login (page) {
  yield page.setUserAgent('Mozilla/5.0(Macintosh;U;IntelMacOSX10_6_8;en-us)AppleWebKit/534.50(KHTML,likeGecko)Version/5.1Safari/534.50');
  yield page.goto('https://passport.weibo.cn/signin/login?entry=mweibo&res=wel&wm=3349&r=https%3A%2F%2Fm.weibo.cn%2Fbeta');
  yield page.waitForSelector('#loginName', {timeout: 30000});
  yield delay(1000);
  yield page.click('#loginName');
  yield page.focus('#loginName');
  const username = nconf.get('username');
  yield page.type(username);
  yield delay(1000);
  yield page.click('#loginPassword');
  yield page.focus('#loginPassword');
  const password = nconf.get('password');
  yield page.type(password);
  const submitBtn = yield page.$('#loginAction');
  yield submitBtn.click();
  return page.waitForSelector('.lite-iconf-profile', 20000);
}

module.exports = login;

