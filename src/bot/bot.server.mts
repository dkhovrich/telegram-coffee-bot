import { Telegraf } from "telegraf";
import { ConfigService } from "../services/config.service.mjs";
import { Middleware } from "./middlewares/middleware.types.mjs";
import { Command } from "./commands/command.mjs";
import { StorageService } from "../storage/storage.types.mjs";
import { BotContext, TelegrafBot } from "./types.mjs";
import { Bot, BotFactory } from "./bot.types.mjs";

export class BotServer implements Bot {
    protected readonly bot: TelegrafBot;
    private readonly commands: Command[];

    public constructor(
        commandsFactory: BotFactory<Command[]>,
        protected readonly config: ConfigService,
        private readonly storage: StorageService,
        private readonly middlewares: Middleware[]
    ) {
        this.bot = this.createBot();
        this.commands = commandsFactory(this.bot);
        this.middlewares.forEach(middleware => this.bot.use(middleware.create()));
    }

    async init(): Promise<void> {
        try {
            await this.storage.init();
            for (const command of this.commands) {
                command.handle();
            }
            this.bot.catch(error => console.error("bot error", error));
        } catch (error) {
            console.error("init error", error);
            process.exit(1);
        }
    }

    async start(): Promise<void> {
        try {
            process.once("SIGINT", () => this.bot.stop("SIGINT"));
            process.once("SIGTERM", () => this.bot.stop("SIGTERM"));

            console.log("Starting bot in server mode");
            await this.bot.launch();
        } catch (error) {
            console.error("start error", error);
            process.exit(1);
        }
    }

    protected createBot(): TelegrafBot {
        return new Telegraf<BotContext>(this.config.token);
    }
}
