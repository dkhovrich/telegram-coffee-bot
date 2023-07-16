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

            this.logger.info("Starting bot", { mode: "server" });
            await this.bot.launch();
        } catch (error) {
            this.logger.error("Start", { error });
            process.exit(1);
        }
    }
}
