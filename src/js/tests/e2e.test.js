// @ts-check
import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

test.describe('Setup', () => {
  let page = null;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });
});

async function createRequestInterceptor(page, data) {
  const headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'OPTIONS, GET, POST, PUT, DELETE',
    'access-control-max-age': '2592000',
    'access-control-allow-headers': 'Cache-Control, Content-Type',
  };
  await page.route(`${process.env.HOST}/help-desk/fetch`, (route) =>
    route.fulfill({
      status: 200,
      headers,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'Fetched', data: data ?? [] }),
    }),
  );
  await page.route(`${process.env.HOST}/help-desk/batch`, (route, req) => {
    if (req.method() === 'OPTIONS') {
      route.fulfill({ status: 204, headers });
    } else if (req.method() === 'POST') {
      route.fulfill({
        status: 200,
        headers,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'Batch applied',
          data: JSON.parse(req.postData()),
        }),
      });
    }
  });
}

const data = [
  {
    id: uuidv4(),
    done: false,
    name: 'Name',
    description: 'Description',
    date: '02.02.2022, 02:02',
  },
];

test.describe('E2E', async () => {
  test('Add', async ({ page }) => {
    await createRequestInterceptor(page);
    await page.goto('/', { waitUntil: 'networkidle' });

    const plus = await page.locator('.title-container-plus-content');
    await plus.click();
    const modal = await page.locator('div.modal');
    await expect(modal).not.toHaveCount(0);

    const save = await page.locator('button.save');
    await expect(save).toBeDisabled();

    const name = await page.locator('#title');
    await name.fill('A ticket title');
    const description = await page.locator('#description');
    await description.fill('A description for a ticket');
    await save.click();
    await expect(modal).toHaveCount(0);

    const ticket = await page.locator('.list-item .list-item-title');
    await expect(ticket).toHaveText('A ticket title');

    await ticket.click();
    await expect(
      await page.locator('.list-item .list-item-description'),
    ).toHaveText('A description for a ticket');
  });

  test('Update + Error', async ({ page }) => {
    await createRequestInterceptor(page, data);
    await page.goto('/', { waitUntil: 'networkidle' });

    const update = await page.locator('button:has(.list-item-actions-update)');
    await update.click();
    const modal = await page.locator('div.modal');
    await expect(modal).not.toHaveCount(0);

    const save = await page.locator('button.save');
    await expect(save).toBeDisabled();

    const name = await page.locator('#title');
    await name.click({ clickCount: 3 });
    await name.fill('1');
    await name.press('Backspace');
    const description = await page.locator('#description');
    await description.click();
    await new Promise((resolve) => setTimeout(() => resolve(), 1000));
    const error = await page.locator('.error-name');
    await expect(error).toHaveCount(1);

    await name.fill('Another ticket title');
    await description.click({ clickCount: 3 });
    await description.fill('Another description for a ticket');
    await new Promise((resolve) => setTimeout(() => resolve(), 1000));
    await expect(error).toHaveCount(0);

    await save.click();
    await expect(modal).toHaveCount(0);

    const ticketUpdated = await page.locator('.list-item .list-item-title');
    await expect(ticketUpdated).toHaveText('Another ticket title');

    await ticketUpdated.click();
    await expect(
      await page.locator('.list-item .list-item-description'),
    ).toHaveText('Another description for a ticket');
  });

  test('Delete', async ({ page }) => {
    await createRequestInterceptor(page, data);
    await page.goto('/', { waitUntil: 'networkidle' });

    const remove = await page.locator('button:has(.list-item-actions-delete)');
    await remove.click();
    const modal = await page.locator('div.modal');
    await expect(modal).toContainText('Do you want to remove this ticket?');

    const deleteButton = await page.locator('button.delete');
    await deleteButton.click();
    await expect(modal).toHaveCount(0);
    await expect(await page.locator('.list-item .list-item-title')).toHaveCount(
      0,
    );
  });
});
