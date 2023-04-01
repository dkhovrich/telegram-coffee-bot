import { Context, Telegraf } from "telegraf";
import { BotProvider } from "../bot.provider.mjs";

export abstract class Command {
    protected constructor(private readonly provider: BotProvider) {}

    protected get bot(): Telegraf<Context> {
        return this.provider.bot;
    }

    public abstract handle(): void;
}
