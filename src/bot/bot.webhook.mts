import functions from "@google-cloud/functions-framework";
import { TelegrafBot } from "./types.mjs";
import { Telegraf } from "telegraf";
import { Bot } from "./bot.mjs";

export class BotWebhook extends Bot {
    protected createBot(): TelegrafBot {
        return new Telegraf(this.token, { telegram: { webhookReply: true } });
    }

    public async start(): Promise<void> {
        console.log("Starting bot in WebHook mode");
        functions.http("bot", async (request, response) => {
            await this.bot.handleUpdate(request.body, response);
        });
    }
}
