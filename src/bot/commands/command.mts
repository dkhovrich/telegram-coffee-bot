import { Telegraf } from "telegraf";
import { BotContext } from "../context.mjs";

export abstract class Command {
    public abstract handle(bot: Telegraf<BotContext>): void;
}
