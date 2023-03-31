import { Command } from "./command.mjs";
import { Markup } from "telegraf";
import { StorageService } from "../../storage/storage.types.mjs";

export class RecycleCommand extends Command {
    private readonly confirmButtonId = "reset-confirm";
    private readonly cancelButtonId = "reset-cancel";
    private static readonly MIN_RECYCLE_AMOUNT = 100;

    public constructor(private readonly storage: StorageService) {
        super();
    }

    public handle(): void {
        this.bot.command("recycle", async ctx => {
            const amount = await this.storage.get();
            if (amount < RecycleCommand.MIN_RECYCLE_AMOUNT) {
                ctx.reply("You don't have enough capsules to recycle! ♻️");
                return;
            }
            ctx.reply(
                "Are you sure you want to recycle all your capsules? 🤔",
                Markup.inlineKeyboard([
                    Markup.button.callback("Yes", this.confirmButtonId),
                    Markup.button.callback("No", this.cancelButtonId)
                ])
            );
        });
        this.handleConfirmationActions();
    }

    private handleConfirmationActions(): void {
        this.bot.action(this.confirmButtonId, async ctx => {
            if (ctx.from?.username == null) return;
            await this.storage.recycle(ctx.from.username);
            ctx.editMessageText("All your capsules have been recycled! ♻️");
        });

        this.bot.action(this.cancelButtonId, async ctx => {
            ctx.editMessageText("Okay, come back with capsules later! ☕️");
        });
    }
}
