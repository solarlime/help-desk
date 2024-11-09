import Page from './page.js';

export default class App {
  static async init() {
    const page = new Page();
    await page.update(true);
    page.addListeners();
  }
}
