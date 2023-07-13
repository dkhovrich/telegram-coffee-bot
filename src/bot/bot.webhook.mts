import functions from "@google-cloud/functions-framework";
import { BotServer } from "./bot.server.mjs";
import { TelegrafBot } from "./types.mjs";
import { Telegraf } from "telegraf";

export class BotWebhook extends BotServer {
    protected override createBot(): TelegrafBot {
        return new Telegraf(this.config.token, { telegram: { webhookReply: true } });
    }

    public override async start(): Promise<void> {
        console.log("Starting bot in WebHook mode");
        functions.http("bot", async (request, response) => {
            await this.bot.handleUpdate(request.body, response);
        });
    }
}
