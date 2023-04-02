import { Context, Telegraf } from "telegraf";
import { assert } from "../utils/assert.mjs";

export interface IBaseBot {
    get bot(): Telegraf<Context>;
    setBot(bot: Telegraf<Context>): void;
}

export abstract class BaseBot implements BaseBot {
    private _bot: Telegraf<Context> | null = null;

    get bot(): Telegraf<Context> {
        assert(this._bot != null, "Bot is not initialized");
        return this._bot;
    }

    public setBot(bot: Telegraf<Context>): void {
        this._bot = bot;
    }
}
