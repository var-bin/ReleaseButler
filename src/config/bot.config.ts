export class BotConfig {
  id = "596041543";
  token = process.env.BOT_TOKEN;
  name = "ReleaseButler";

  constructor() { }

  get botToken(): string {
    return `${this.id}:${this.token}`;
  }

  get botName(): string {
    return this.name;
  }
}
