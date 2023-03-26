import { Context, Markup, Scenes, Telegraf } from "telegraf";
import { z } from "zod";
import { message } from "telegraf/filters";

export interface QuestionProps<T> {
    id: string;
    text: string;
    errorMessage: string;
    schema: z.ZodType<T>;
    confirmation: {
        question(value: T): string;
        confirm(value: T, user: string): Promise<string>;
        cancel: string;
    };
}

export class QuestionWithConfirmation<T> {
    private readonly confirmButtonId: string;
    private readonly cancelButtonId: string;
    private value: T | null = null;

    constructor(private readonly bot: Telegraf<Context>, private readonly props: QuestionProps<T>) {
        this.confirmButtonId = `${props.id}-confirm`;
        this.cancelButtonId = `${props.id}-cancel`;
        this.handleConfirmationActions();
    }

    public init(): void {
        const scene = this.createScene();
        // @ts-ignore
        const stage = new Scenes.Stage([scene]);
        // @ts-ignore
        this.bot.use(stage.middleware());
    }

    private createScene(): Scenes.BaseScene {
        const question = new Scenes.BaseScene(this.props.id);

        question.enter(ctx => ctx.reply(this.props.text));

        question.on(message("text"), async ctx => {
            const result = this.props.schema.safeParse(ctx.message.text);
            if (!result.success) {
                ctx.reply(this.props.errorMessage);
                // @ts-ignore
                ctx.scene.leave();
                return;
            }

            this.value = result.data;
            ctx.reply(
                this.props.confirmation.question(this.value),
                Markup.inlineKeyboard([
                    Markup.button.callback("Yes", this.confirmButtonId),
                    Markup.button.callback("No", this.cancelButtonId)
                ])
            );

            // @ts-ignore
            ctx.scene.leave();
        });

        return question;
    }

    private handleConfirmationActions(): void {
        this.bot.action(this.confirmButtonId, async ctx => {
            if (this.value == null || ctx.from?.username == null) return;
            const text = await this.props.confirmation.confirm(this.value, ctx.from.username);
            ctx.editMessageText(text);
        });

        this.bot.action(this.cancelButtonId, ctx => {
            ctx.editMessageText(this.props.confirmation.cancel);
        });
    }
}
