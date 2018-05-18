import * as telebot from "telebot";
import * as path from "path";
import * as fs from "fs";
const FormData = require("form-data");
const request = require("request");

import { BotConfig } from "./config/bot.config";
import { FrameworksConfig } from "./config/frameworks.config";
import { ReleasesModule } from "./releases/releases";

const botConfig = new BotConfig();
const bot = new telebot(botConfig.botToken);
const frameworksConfig = new FrameworksConfig();
const releasesModule = new ReleasesModule();
const formData = new FormData();

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
      const sendPhotoUrl = `https://api.telegram.org/bot${botConfig.botToken}/sendPhoto`;
      const formData = {
        chat_id: msg.from.id,
        // replace with dynamical filename
        photo: fs.createReadStream("./src/assets/images/1526327095455.png")
      };

      return releasesModule.latestReleaseBody
        .then((text: any) => {
          // need to use request.post for simulating multipart/form-data submitting
          // https://core.telegram.org/bots/api#sending-files
          // replace request module -> form-data module because of less dependencies

          // text.html_url
          // need to use https://blog.github.com/2011-11-10-git-io-github-url-shortener/ for shorting url
          formData["caption"] = `For more info, please, follow this link: ${text.html_url}`;

          request.post({
            url: sendPhotoUrl,
            formData: formData
          }, (err, httpResponse, body) => {
            if (err) {
              return console.error("Upload failed: ", err);
            }

            console.log("Upload successful! Server responded with: ", body);
          });
        });
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
