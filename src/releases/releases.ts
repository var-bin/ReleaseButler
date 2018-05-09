const octokit = require("@octokit/rest")();

import { FrameworksConfig } from "../config/frameworks.config";

const frameworksConfig = new FrameworksConfig();

export class ReleasesModule {
  owner = frameworksConfig.getFrameworkOwner("react");
  repo = frameworksConfig.getFrameworkName("react");

  constructor() {
    this.latestReleaseBody
      .then(body => console.log(body));
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
