import { Context, Telegraf } from "telegraf";
import { ConfigService } from "../services/config.service.mjs";
import { Middleware } from "./middlewares/middleware.types.mjs";
import { Command } from "./commands/command.mjs";
import { StorageService } from "../storage/storage.types.mjs";

export class Bot {
    private readonly bot: Telegraf<Context>;

    public constructor(
        private readonly config: ConfigService,
        private readonly storage: StorageService,
        private readonly commands: Command[],
        private readonly middlewares: Middleware[]
    ) {
        this.bot = new Telegraf<Context>(this.config.get("TOKEN"));
        this.middlewares.forEach(middleware => this.bot.use(middleware.create()));
    }

    public async init(): Promise<void> {
        try {
            await this.storage.init();

            for (const command of this.commands) {
                command.setBot(this.bot);
                command.handle();
            }

            process.once("SIGINT", () => this.bot.stop("SIGINT"));
            process.once("SIGTERM", () => this.bot.stop("SIGTERM"));

            console.log("Starting bot...");
            await this.bot.launch();
        } catch (error) {
            console.error("init error", error);
            process.exit(1);
        }
    }
}
