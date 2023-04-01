import { Context, Telegraf } from "telegraf";
import { assert } from "../utils/assert.mjs";

export interface BotProvider {
    bot: Telegraf<Context>;
}

export class BotProviderImpl implements BotProvider {
    private _bot: Telegraf<Context> | null = null;

    get bot(): Telegraf<Context> {
        assert(this._bot != null, "Bot is not set");
        return this._bot;
    }

    set bot(value: Telegraf<Context>) {
        this._bot = value;
    }
}
