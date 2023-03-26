import { Context, Telegraf } from "telegraf";

export abstract class Command {
    protected bot!: Telegraf<Context>;

    public setBot(bot: Telegraf<Context>): void {
        this.bot = bot;
    }

    public abstract handle(): void;
}
