import { TelegrafBot } from "./types.mjs";
import { Command } from "./commands/command.mjs";
import { BotFactory } from "./bot.types.mjs";
import { Config } from "../config.mjs";
import { Middleware } from "./middlewares/middleware.types.mjs";
import { LoggerFactory } from "../logger/logger.factory.mjs";
import { Logger } from "../logger/types.mjs";

export interface IBot {
    init(): Promise<void>;
    start(): Promise<void>;
}

export abstract class Bot implements IBot {
    private readonly commands: Command[];
    protected readonly bot: TelegrafBot;
    protected readonly logger: Logger;

    public constructor(
        private readonly config: Config,
        loggerFactory: LoggerFactory,
        commandsFactory: BotFactory<Command[]>,
        middlewares: Middleware[]
    ) {
        this.logger = loggerFactory.create("bot");
        this.bot = this.createBot();
        this.commands = commandsFactory(this.bot);
        middlewares.forEach(middleware => this.bot.use(middleware.create()));
    }

    public get token(): string {
        return this.config.token;
    }

    public async init(): Promise<void> {
        try {
            for (const command of this.commands) {
                command.handle();
            }
            this.bot.catch(error => this.logger.error("Bot", { error }));
        } catch (error) {
            this.logger.error("Init", { error });
            process.exit(1);
        }
    }

    protected abstract createBot(): TelegrafBot;

    public abstract start(): Promise<void>;
}
