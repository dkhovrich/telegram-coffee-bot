import { Container, injected, token } from "brandi";
import { ConfigService, ConfigServiceImpl } from "./services/config.service.mjs";
import { Bot } from "./bot/bot.mjs";
import { StartCommand } from "./bot/commands/start.command.mjs";
import { Command } from "./bot/commands/command.mjs";

export const TOKENS = {
    configService: token<ConfigService>("config"),
    bot: token<Bot>("bot"),
    commands: {
        start: token<StartCommand>("command.start"),
        all: token<Command[]>("commands")
    }
};

function bindCommands(container: Container): void {
    container.bind(TOKENS.commands.start).toInstance(StartCommand).inSingletonScope();
    container.bind(TOKENS.commands.all).toConstant([container.get(TOKENS.commands.start)]);
}

export function createContainer(): Container {
    const container = new Container();

    container.bind(TOKENS.configService).toInstance(ConfigServiceImpl).inSingletonScope();
    bindCommands(container);
    injected(Bot, TOKENS.configService, TOKENS.commands.all);
    container.bind(TOKENS.bot).toInstance(Bot).inSingletonScope();

    return container;
}
