const { fork } = require('child_process');
const puppeteer = require('puppeteer');

jest.setTimeout(30000);
describe('E2E', () => {
  let browser = null;
  let page = null;
  let server = null;
  const url = 'http://localhost:9090';
  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', () => {
        reject();
      });
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });
    browser = await puppeteer.launch({
      headless: true,
      // headless: false,
      // slowMo: 50,
      // devtools: true,
    });
    page = await browser.newPage();
  });
  afterAll(async () => {
    await browser.close();
    server.kill();
  });
  describe('Tests', () => {
    async function createRequestInterceptor() {
      const headers = {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'OPTIONS, GET, POST, PUT, DELETE',
        'access-control-max-age': 2592000,
        'access-control-allow-headers': 'Cache-Control, Content-Type',
      };
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (req.url().endsWith('fetch') || req.url().endsWith('batch')) {
          if (req.method() === 'OPTIONS') {
            req.respond({ status: 204, headers });
          } else if (req.method() === 'POST') {
            req.respond({
              status: 200,
              headers,
              contentType: 'application/json',
              body: JSON.stringify({
                status: 'Batch applied',
                data: req.postData(),
              }),
            });
          } else {
            req.respond({
              status: 200,
              headers,
              contentType: 'application/json',
              body: JSON.stringify({ status: 'Fetched', data: [] }),
            });
          }
        } else {
          req.continue();
        }
      });
    }

    test('Add, update, delete', async () => {
      await createRequestInterceptor();
      await page.goto(url);
      // Add
      let plus = await page.$('[class=title-container-plus]');
      plus.click();
      await page.waitForFunction(() => document.querySelector('div.modal'));
      let name = await page.$('input[id=title]');
      await name.type('A ticket title');
      let description = await page.$('textarea[id=description]');
      await description.type('A description for a ticket');
      let save = await page.locator('button[class=save]');
      await save.click();
      await page.waitForFunction(() => !document.querySelector('div.modal'));
      await page.waitForFunction(
        () =>
          document.querySelector('.list-item .list-item-title').textContent ===
          'A ticket title',
      );
      const ticket = await page.$('[class=list-item] [class=list-item-title]');
      ticket.click();
      await page.waitForFunction(
        () =>
          document.querySelector('.list-item .list-item-description')
            .textContent === 'A description for a ticket',
      );

      // Update
      const update = await page.$('svg[class=list-item-actions-update]');
      update.click();
      await page.waitForFunction(() => document.querySelector('div.modal'));
      name = await page.$('input[id=title]');
      await name.click({ clickCount: 3 });
      await name.type('Another ticket title');
      description = await page.$('textarea[id=description]');
      await description.click({ clickCount: 3 });
      await description.type('Another description for a ticket');
      await page.locator('button[class=save]');
      save.click();
      await page.waitForFunction(() => !document.querySelector('div.modal'));
      await page.waitForFunction(
        () =>
          document.querySelector('.list-item .list-item-title').textContent ===
          'Another ticket title',
      );
      const ticketNew = await page.$(
        '[class=list-item] [class=list-item-title]',
      );
      ticketNew.click();
      await page.waitForFunction(
        () =>
          document.querySelector('.list-item .list-item-description')
            .textContent === 'Another description for a ticket',
      );

      // Delete
      const remove = await page.$('svg[class=list-item-actions-delete]');
      remove.click();
      await page.waitForFunction(() => document.querySelector('div.modal'));
      const destroy = await page.$('button[class=delete]');
      destroy.click();
      await page.waitForFunction(() => !document.querySelector('div.modal'));
      await page.waitForFunction(
        () => !document.querySelector('.list-item .list-item-title'),
      );

      // Errors
      plus = await page.$('[class=title-container-plus]');
      plus.click();
      await page.waitForFunction(() => document.querySelector('div.modal'));
      name = await page.$('input[id=title]');
      await name.type('1');
      await name.press('Backspace');
      description = await page.$('textarea[id=description]');
      await description.click();
      await page.waitForFunction(() => document.querySelector('.error-name'));
      await page.waitForFunction(
        () => document.querySelector('.save').disabled,
      );
    });
  });
});
