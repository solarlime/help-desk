import { test, expect, Page } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import type { ITicket } from '../../types/store';

test.describe('Setup', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });
});

async function createRequestInterceptor(page: Page, data?: Array<ITicket>) {
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
          data: JSON.parse(req.postData() as string),
        }),
      });
    }
  });
}

const data: Array<ITicket> = [
  {
    id: uuidv4(),
    done: false,
    name: 'Name',
    description: 'Description',
    date: '02.02.2022, 02:02',
  },
];

async function addTicket(page: Page) {
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
}

test.describe('E2E', async () => {
  test('Add', async ({ page }) => {
    await createRequestInterceptor(page);
    await page.goto('/', { waitUntil: 'networkidle' });

    await addTicket(page);

    const ticket = await page.locator('.list-item .list-item-title');
    await expect(ticket).toHaveText('A ticket title');

    await ticket.click();
    await expect(
      await page.locator('.list-item .list-item-description'),
    ).toHaveText('A description for a ticket');
  });

  test('Modes', async ({ page }) => {
    await createRequestInterceptor(page, data);
    await page.goto('/', { waitUntil: 'networkidle' });

    const ticket = await page.locator('.list-item .list-item-title');
    await expect(ticket).toHaveText('Name');

    const allTab = await page.locator('button[name="all"]');
    await expect(allTab).toBeDisabled();

    const activeTab = await page.locator('button[name="active"]');
    await expect(activeTab).not.toBeDisabled();

    const doneTab = await page.locator('button[name="done"]');
    await expect(doneTab).not.toBeDisabled();

    await doneTab.click();
    await expect(allTab).not.toBeDisabled();
    await expect(doneTab).toBeDisabled();
    await expect(ticket).not.toBeAttached();

    await activeTab.click();
    await expect(activeTab).toBeDisabled();
    await expect(doneTab).not.toBeDisabled();
    await expect(ticket).toBeAttached();

    const checkbox = await page.locator('.list-item .list-item-done + label');
    await checkbox.click();
    await expect(ticket).not.toBeAttached();

    await doneTab.click();
    await expect(ticket).toBeAttached();
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
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
    const error = await page.locator('.error-name');
    await expect(error).toHaveCount(1);

    await name.fill('Another ticket title');
    await description.click({ clickCount: 3 });
    await description.fill('Another description for a ticket');
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
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

  test('Delete all', async ({ page }) => {
    await createRequestInterceptor(page, data);
    await page.goto('/', { waitUntil: 'networkidle' });

    const removeAll = await page.locator(
      'button.title-container-clear-content',
    );
    await expect(removeAll).toBeDisabled();

    const switcherActiveButton = await page.locator('button[name="active"]');
    await expect(switcherActiveButton).not.toBeDisabled();
    await expect(switcherActiveButton).toHaveText('Active (1)');

    const switcherDoneButton = await page.locator('button[name="done"]');
    await expect(switcherDoneButton).not.toBeDisabled();
    await expect(switcherDoneButton).toHaveText('Done (0)');

    const checkbox = await page.locator('.list-item .list-item-done + label');
    await checkbox.click();
    await expect(removeAll).not.toBeDisabled();
    await expect(switcherDoneButton).toHaveText('Done (1)');
    await expect(switcherActiveButton).toHaveText('Active (0)');

    await addTicket(page);

    const checkbox2 = await page.locator(
      '.list-item .list-item-done:not(:checked) + label',
    );
    await expect(switcherActiveButton).toHaveText('Active (1)');

    await checkbox2.click();
    await expect(switcherDoneButton).toHaveText('Done (2)');
    await expect(switcherActiveButton).toHaveText('Active (0)');

    await removeAll.click();
    const modal = await page.locator('div.modal');
    await expect(modal).toContainText('Do you want to remove 2 tickets?');
    //
    const deleteButton = await page.locator('button.delete');
    await deleteButton.click();
    await expect(modal).toHaveCount(0);
    await expect(await page.locator('.list-item .list-item-title')).toHaveCount(
      0,
    );
    await expect(switcherActiveButton).toHaveText('Active (0)');
    await expect(switcherDoneButton).toHaveText('Done (0)');
  });
});
