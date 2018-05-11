import * as octokit_rest from "@octokit/rest";
const octokit: octokit_rest = require("@octokit/rest")();
import * as puppeteer from "puppeteer";

import { FrameworksConfig } from "../config/frameworks.config";

const frameworksConfig = new FrameworksConfig();

export class ReleasesModule {
  owner = frameworksConfig.getFrameworkOwner("react");
  repo = frameworksConfig.getFrameworkName("react");

  constructor() {
    this.latestReleaseBody
      .then(text => {
        octokit.misc.renderMarkdown({
          text
        })
          .then(renderValue => {
            console.log("renderMarkdown: \n", renderValue.data);

            (async () => {
              const browser = await puppeteer.launch();
              const page = await browser.newPage();
              const id = Date.now();

              await page.setContent(renderValue.data);
              console.log(await page.mainFrame().content());
              await page.screenshot({
                path: `${id}.jpg`
              });

              await browser.close();
            })();
          });
      });
    /* this.latestReleaseBody
      .then(text => {
        (async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto('https://example.com');
          await page.screenshot({ path: 'example.png' });

          await browser.close();
        })();
      }); */
  }

  get latestRelease() {
    return octokit.repos.getLatestRelease({
      owner: this.owner,
      repo: this.repo
    }).then(result => result);
  }

  get latestReleaseBody() {
    return this.latestRelease
      .then(data => data.data.body);
  }
}
