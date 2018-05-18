import * as puppeteer from "puppeteer";
import * as path from "path";

export class Screenshots {
  public styles = {
    material: path.resolve("src/assets/css/material.min.css"),
    mainStyles: path.resolve("src/assets/css/styles.css")
  };

  private SCREENSHOT_PATH: string = path.resolve("src/assets/images");
  private ID: number = Date.now();
  private screenshot = path.join(this.SCREENSHOT_PATH, `${this.ID}.png`);

  constructor() { }

  async makeScreenshot(screenshotData: string): Promise<void> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const pageContent = `<div class="release-holder">${this.ID}\n${screenshotData}</div>`;

    await page.setContent(pageContent);
    await page.addStyleTag({
      path: this.styles.material
    });
    await page.addStyleTag({
      path: this.styles.mainStyles
    });
    await page.screenshot({
      path: this.screenshot,
      fullPage: true
    });

    await browser.close();
  }

  get screenshotId(): number {
    return this.ID;
  }
}
