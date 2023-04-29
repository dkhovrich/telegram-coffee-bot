import { assert } from "../utils/assert.mjs";
import { TelegrafBot } from "./types.mjs";

export interface IBaseBot {
    get bot(): TelegrafBot;
    setBot(bot: TelegrafBot): void;
}

export abstract class BaseBot implements BaseBot {
    private _bot: TelegrafBot | null = null;

    get bot(): TelegrafBot {
        assert(this._bot != null, "Bot is not initialized");
        return this._bot;
    }

    public setBot(bot: TelegrafBot): void {
        this._bot = bot;
    }
}
