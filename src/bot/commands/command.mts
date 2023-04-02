import { BaseBot } from "../bot.base.mjs";

export abstract class Command extends BaseBot {
    public abstract handle(): void;
}
