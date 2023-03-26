import { Context, Telegraf } from "telegraf";
import { ConfigService } from "../services/config.service.mjs";
import { Middleware } from "./middlewares/middleware.types.js";
import { Command } from "./commands/command.mjs";

export class Bot {
    private readonly bot: Telegraf<Context>;

    public constructor(
        private readonly config: ConfigService,
        private readonly commands: Command[],
        private readonly middlewares: Middleware[]
    ) {
        this.bot = new Telegraf<Context>(this.config.get("TOKEN"));
        this.middlewares.forEach(middleware => this.bot.use(middleware.create()));
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
