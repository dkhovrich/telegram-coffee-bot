import { Telegraf } from "telegraf";
import { BotContext, TelegrafBot } from "./types.mjs";
import { Bot } from "./bot.mjs";

export class BotServer extends Bot {
    protected createBot(): TelegrafBot {
        return new Telegraf<BotContext>(this.token);
    }

    public async start(): Promise<void> {
        try {
            process.once("SIGINT", () => this.bot.stop("SIGINT"));
            process.once("SIGTERM", () => this.bot.stop("SIGTERM"));

            console.log("Starting bot in server mode");
            await this.bot.launch();
        } catch (error) {
            console.error("start error", error);
            process.exit(1);
        }
    }
}
