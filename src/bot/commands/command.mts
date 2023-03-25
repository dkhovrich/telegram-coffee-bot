import { Telegraf } from "telegraf";
import { BotContext, Session } from "../context.mjs";

export const enum CommandType {
    Start = "start",
    Add = "add",
    Reset = "reset",
    Balance = "balance",
    History = "history"
}

export abstract class Command {
    protected bot!: Telegraf<BotContext>;

    abstract get type(): CommandType;

    public setBot(bot: Telegraf<BotContext>): void {
        this.bot = bot;
    }

    public abstract handle(): void;

    protected setCommandState(session: Session): void {
        session.commandState = this.type;
    }

    protected clearCommandState(session: Session): void {
        session.commandState = null;
    }

    protected isProcessingCommand(session: Session): boolean {
        return session.commandState === this.type;
    }
}
