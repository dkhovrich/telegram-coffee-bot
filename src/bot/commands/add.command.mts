import { z } from "zod";
import { Command } from "./command.mjs";
import { StorageService } from "../../services/storage.service.mjs";
import { QuestionWithConfirmation } from "../question-with-confirmation.mjs";

export class AddCommand extends Command {
    public constructor(private readonly storage: StorageService) {
        super();
    }

    public handle(): void {
        const question = new QuestionWithConfirmation(this.bot, {
            id: "add",
            text: "How many capsules would you like to add? ☕️",
            errorMessage: "Invalid value. Please use /add command again ⚠️",
            schema: z.coerce.number(),
            confirmation: {
                question(value) {
                    return `Are you sure you want to ${value > 0 ? "add" : "remove"} ${Math.abs(value)} capsules? 🤔`;
                },
                confirm: this.onConfirm.bind(this),
                cancel: "Okay, come back with capsules later! ☕️"
            }
        });
        question.init();

        // @ts-ignore
        this.bot.command("add", ctx => ctx.scene.enter("add"));
    }

    private async onConfirm(capsules: number, user: string): Promise<string> {
        const amount = await this.storage.add(capsules, user);
        return `${capsules > 0 ? "Added" : "Removed"} ${capsules} capsules. Total amount: ${amount}`;
    }
}
