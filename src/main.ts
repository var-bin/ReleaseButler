import * as telebot from "telebot";

import { BotConfig } from "./config/bot.config";
import { FrameworksConfig } from "./config/frameworks.config";
import { ReleasesModule } from "./releases/releases";

const botConfig = new BotConfig();
const bot = new telebot(botConfig.botToken);
const frameworksConfig = new FrameworksConfig();
const releasesModule = new ReleasesModule();

export class MainModule {
  protected frameworks = [{
    "angular": {
      name: "angular",
      www: "https://angular.io",
      repository: {
        type: "git",
        url: "https://github.com/angular/angular.git"
      }
    },
    "react": {
      name: "react",
      www: "https://reactjs.org",
      repository: {
        type: "git",
        url: "https://github.com/facebook/react.git"
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
    /frameworks - get a list of frameworks
    /latestreleases - get latest releases of frameworks/libraries`;

    return help;
  }

  protected getFrameworksMessage(message: any): string {
    const msgId = message.from.id;
    const userName = message.from.first_name;


    const info = `Hello, ${userName}!

    Below, you can find all frameworks whose I observe:
    ${frameworksConfig.formatFrameworks.join("\n")}`;

    return info;
  }

  protected onHelp(command: string) {
    bot.on(command, (msg) => {
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

  protected onLatestReleases() {
    bot.on("/latestreleases", (msg) => {
      return releasesModule.latestReleaseBody
        .then((text) => bot.sendMessage(msg.from.id, text));
    });
  }

  protected onStart() {
    this.onHelp("/start");
  }

  protected start() {
    bot.start();
  }

  init() {
    this.onStart();
    this.onHelp("/help");
    this.onFrameworks();
    this.onLatestReleases();

    this.start();
  }
}
