import { Context } from "telegraf";
import { CommandType } from "./commands/command.mjs";

export interface Session {
    commandState: CommandType | null;
}

export interface BotContext extends Context {
    session: Session;
}
