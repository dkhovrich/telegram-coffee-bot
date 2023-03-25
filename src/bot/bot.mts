import { Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";
import { ConfigService } from "../services/config.service.mjs";
import { BotContext } from "./context.mjs";
import { Command } from "./commands/command.mjs";

export class Bot {
    private readonly bot: Telegraf<BotContext>;

    public constructor(private readonly configService: ConfigService, private readonly commands: Command[]) {
        this.bot = new Telegraf<BotContext>(this.configService.get("TOKEN"));
        this.bot.use(new LocalSession({ database: "sessions.json" }).middleware());
    }

    public async init(): Promise<void> {
        for (const command of this.commands) {
            command.handle(this.bot);
        }
        console.log("Starting bot...");
        await this.bot.launch();
    }
}
