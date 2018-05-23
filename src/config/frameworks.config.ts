export class FrameworksConfig {
  protected frameworks = [{
    "angular": {
      name: "angular",
      owner: "angular",
      www: "https://angular.io",
      repository: {
        type: "git",
        url: "https://github.com/angular/angular.git"
      }
    },
    "react": {
      name: "react",
      owner: "facebook",
      www: "https://reactjs.org",
      repository: {
        type: "git",
        url: "https://github.com/facebook/react.git"
      }
    }
  }];

  get formatFrameworks(): any[] {
    const frmwrkInfoRes = [];

    this.frameworks.map((frmwrk) => {
      let frmwrkInfo = "";

      for (const key in frmwrk) {
        if (frmwrk.hasOwnProperty(key)) {
          const frmwrkName = frmwrk[key].name;
          const frmwrkWww = frmwrk[key].www;
          const frmwrkRepository = frmwrk[key].repository.url;

          frmwrkInfoRes.push(`[${frmwrkName}](${frmwrkWww}): [${frmwrkRepository}](${frmwrkRepository})`);
        }
      }
    });

    return frmwrkInfoRes;
  }

  getFrameworkOwner(frameworkName) {
    return this.frameworks[0][frameworkName].owner;
  }

  getFrameworkName(frameworkName) {
    return this.frameworks[0][frameworkName].name;
  }
}
