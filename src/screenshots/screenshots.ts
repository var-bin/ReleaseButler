import * as puppeteer from "puppeteer";
import * as path from "path";
import * as fs from "fs";

export class ScreenshotsModule {
  styles = {
    material: path.resolve("src/assets/css/material.min.css"),
    mainStyles: path.resolve("src/assets/css/styles.css")
  };

  private SCREENSHOT_PATH: string = path.resolve("src/assets/images");
  private ID: number = Date.now();
  private screenshot = path.join(this.SCREENSHOT_PATH, `${this.ID}.png`);

  constructor() { }

  async makeScreenshot(screenshotData: string): Promise<number> {
    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
    });
    const page = await browser.newPage();
    const pageContent = `<div class="release-holder">${screenshotData}</div>`;

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

    return this.ID;
  }

  getScreenshot(id: number): Promise<fs.ReadStream> {
    return new Promise((resolve, reject) => {
      if (!id) {
        reject("Ooop...");
      }

      resolve(fs.createReadStream(path.join(this.SCREENSHOT_PATH, `${id}.png`)));
    });
  }
}
