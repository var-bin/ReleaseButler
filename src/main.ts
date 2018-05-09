import * as telebot from "telebot";

import { BotConfig } from "./config/bot.config";

const botConfig = new BotConfig();
const bot = new telebot(botConfig.botToken);

export class MainModule {
  protected frameworks = [{
    "angular": {
      name: "angular",
      www: "https://angular.io",
      repository: {
        type: "git",
        url: "git+https://github.com/angular/angular.git"
      }
    },
    "react": {
      name: "react",
      www: "https://reactjs.org",
      repository: {
        type: "git",
        url: "git+https://github.com/facebook/react.git"
      }
    }
  }];

  constructor() { }

  protected getHelpMessage(message: any): string {
    const msgId = message.from.id;
    const userName = message.from.first_name;

    const help = `Hello, ${userName}!

    My name's @${botConfig.botName}. I can help you to stay up to date with the new versions of used libraries/frameworks. Bellow you can find a list of *available commands*:

    /help - show help message
    /frameworks - get a list of frameworks`;

    return help;
  }

  protected formatFrameworks(frmwrks: any[]): any[] {
    const frmwrkInfoRes = [];

    frmwrks.map((frmwrk) => {
      let frmwrkInfo = "";

      for (const key in frmwrk) {
        if (frmwrk.hasOwnProperty(key)) {
          const frmwrkName = frmwrk[key].name;
          const frmwrkWww = frmwrk[key].www;
          const frmwrkRepository = frmwrk[key].repository.url;

          frmwrkInfoRes.push(`[${frmwrkName}](${frmwrkWww}): [${frmwrkRepository}](${frmwrkRepository.substr(4)})`);
        }
      }
    });

    return frmwrkInfoRes;
  }

  protected getFrameworksMessage(message: any): string {
    const msgId = message.from.id;
    const userName = message.from.first_name;


    const info = `Hello, ${userName}!

    Below, you can find all frameworks whose I observe:
    ${this.formatFrameworks(this.frameworks).join("\n")}`;

    return info;
  }

  protected onHelp() {
    bot.on("/help", (msg) => {
      return bot.sendMessage(msg.from.id, this.getHelpMessage(msg), {
        parseMode: "Markdown"
      });
    });
  }

  protected onFrameworks() {
    bot.on("/frameworks", (msg) => {
      return bot.sendMessage(msg.from.id, this.getFrameworksMessage(msg), {
        parseMode: "Markdown"
      });
    });
  }

  protected start() {
    bot.start();
  }

  init() {
    this.onHelp();
    this.onFrameworks();

    this.start();
  }
}
