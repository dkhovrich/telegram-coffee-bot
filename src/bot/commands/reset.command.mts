import { Command } from "./command.mjs";

export class ResetCommand extends Command {
    public handle(): void {
        this.bot.command("reset", ctx => {
            ctx.reply("RESET");
        });
    }
}
