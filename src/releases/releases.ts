import * as octokit_rest from "@octokit/rest";
const octokit: octokit_rest = require("@octokit/rest")();

import { FrameworksConfig } from "../config/frameworks.config";

const frameworksConfig = new FrameworksConfig();

import { Screenshots } from "../screenshots/screenshots";
const screenshots = new Screenshots();

export class ReleasesModule {
  owner = frameworksConfig.getFrameworkOwner("react");
  repo = frameworksConfig.getFrameworkName("react");

  constructor() { }

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
