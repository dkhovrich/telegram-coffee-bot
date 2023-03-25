import { Telegraf } from "telegraf";
import { ConfigService } from "../services/config.service.mjs";
import { BotContext } from "./context.mjs";
import { Middleware } from "./middlewares/middleware.types.js";
import { Command } from "./commands/command.mjs";

export class Bot {
    private readonly bot: Telegraf<BotContext>;

    public constructor(
        private readonly configService: ConfigService,
        private readonly commands: Command[],
        middlewares: Middleware[]
    ) {
        this.bot = new Telegraf<BotContext>(this.configService.get("TOKEN"));
        middlewares.forEach(middleware => this.bot.use(middleware.create()));
    }

    public async init(): Promise<void> {
        for (const command of this.commands) {
            command.setBot(this.bot);
            command.handle();
        }

        process.once("SIGINT", () => this.bot.stop("SIGINT"));
        process.once("SIGTERM", () => this.bot.stop("SIGTERM"));

        console.log("Starting bot...");
        await this.bot.launch();
    }
}
