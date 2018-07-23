const puppeteer = require('puppeteer');

async function publish(page, text, pictures) {
  if (!(pictures instanceof Array)) {
    pictures = [];
  }
  if (!text && !pictures.length) {
    return Promise.reject('发送内容不能为空！');
  }
  await page.goto('http://weibo.com');
  await page.waitForSelector('#skin_cover_s', {visible: true});
  if (pictures.length) {
    console.log('上传图片', pictures[0])
    await page.click('a[title="图片"]');
    const fileInput = await page.$('input[multiple]');
    await fileInput.uploadFile(...pictures);
    await page.waitFor(pictures.length * 1000);
  } else {
    console.log('没有图片， 跳过图片上传');
  }
  const input = 'textarea[title="微博输入框"]';
  await page.waitFor(input, {visible: true});
  await page.type(input, text || '');
  await page.click('a[title="发布微博按钮"]');
  return page.waitForSelector('.send_succpic', {visible: true});
}

module.exports = publish;
