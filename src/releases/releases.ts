import * as octokit_rest from "@octokit/rest";
const octokit: octokit_rest = require("@octokit/rest")();
import * as puppeteer from "puppeteer";
import * as path from "path";
import * as fs from "fs";

import { FrameworksConfig } from "../config/frameworks.config";

const frameworksConfig = new FrameworksConfig();
const SCREENSHOT_PATH = path.resolve("src/assets/images");

export class ReleasesModule {
  owner = frameworksConfig.getFrameworkOwner("react");
  repo = frameworksConfig.getFrameworkName("react");

  constructor() {
    this.latestReleaseBody
      .then((text: any) => {
        octokit.misc.renderMarkdown({
          text: text.body
        })
          .then(renderValue => {
            // for testing reasons
            /* console.log("renderMarkdown: \n", renderValue.data);
            fs.writeFileSync("index.html", `<div class="release-holder">` + renderValue.data + `</div>`, { encoding: "utf-8"}); */

            console.log(renderValue.data);

            (async () => {
              const browser = await puppeteer.launch();
              const page = await browser.newPage();
              const id = Date.now();
              const pageContent = `<div class="release-holder">${renderValue.data}</div>`;

              await page.setContent(pageContent);
              console.log(await page.mainFrame().content());
              await page.addStyleTag({
                path: path.resolve("src/assets/css/material.min.css")
              });
              await page.addStyleTag({
                path: path.resolve("src/assets/css/styles.css")
              });
              await page.screenshot({
                path: path.join(SCREENSHOT_PATH, `${id}.png`),
                fullPage: true
              });

              await browser.close();
            })();
          });
      });
  }

  get latestRelease() {
    return octokit.repos.getLatestRelease({
      owner: this.owner,
      repo: this.repo
    }).then(result => result);
  }

  get latestReleaseBody(): Promise<octokit_rest.AnyResponse> {
    return this.latestRelease
      .then(data => data.data);
  }
}
