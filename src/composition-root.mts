import { Container, injected, token } from "brandi";
import { ConfigService, ConfigServiceImpl } from "./services/config.service.mjs";
import { Bot } from "./bot/bot.mjs";
import { StartCommand } from "./bot/commands/start.command.mjs";
import { Command } from "./bot/commands/command.mjs";
import { Middleware } from "./bot/middlewares/middleware.types.js";
import { SessionMiddleware } from "./bot/middlewares/session.middleware.mjs";
import { AuthMiddleware } from "./bot/middlewares/auth.middleware.mjs";
import { AddCommand } from "./bot/commands/add.command.mjs";
import { ResetCommand } from "./bot/commands/reset.command.mjs";
import { BalanceCommand } from "./bot/commands/balance.command.mjs";
import { HistoryCommand } from "./bot/commands/history.command.mjs";
import { StorageService, StorageServiceImpl } from "./services/storage.service.mjs";

export const TOKENS = {
    configService: token<ConfigService>("config"),
    bot: token<Bot>("bot"),
    storageService: token<StorageService>("storage"),
    middlewares: {
        session: token<Middleware>("middleware.session"),
        auth: token<Middleware>("middleware.auth"),
        all: token<Middleware[]>("middlewares")
    },
    commands: {
        start: token<Command>("command.start"),
        add: token<Command>("command.add"),
        reset: token<Command>("command.reset"),
        balance: token<Command>("command.balance"),
        history: token<Command>("command.history"),
        all: token<Command[]>("commands")
    }
};

function bindMiddlewares(container: Container): void {
    container.bind(TOKENS.middlewares.auth).toInstance(AuthMiddleware).inSingletonScope();
    container.bind(TOKENS.middlewares.session).toInstance(SessionMiddleware).inSingletonScope();
    container
        .bind(TOKENS.middlewares.all)
        .toConstant([TOKENS.middlewares.auth, TOKENS.middlewares.session].map(token => container.get(token)));
}

function bindCommands(container: Container): void {
    container.bind(TOKENS.commands.start).toInstance(StartCommand).inSingletonScope();

    injected(AddCommand, TOKENS.storageService);
    container.bind(TOKENS.commands.add).toInstance(AddCommand).inSingletonScope();

    container.bind(TOKENS.commands.reset).toInstance(ResetCommand).inSingletonScope();

    injected(BalanceCommand, TOKENS.storageService);
    container.bind(TOKENS.commands.balance).toInstance(BalanceCommand).inSingletonScope();

    container.bind(TOKENS.commands.history).toInstance(HistoryCommand).inSingletonScope();
    container
        .bind(TOKENS.commands.all)
        .toConstant(
            [
                TOKENS.commands.start,
                TOKENS.commands.add,
                TOKENS.commands.reset,
                TOKENS.commands.balance,
                TOKENS.commands.history
            ].map(token => container.get(token))
        );
}

export function createContainer(): Container {
    const container = new Container();
    container.bind(TOKENS.configService).toInstance(ConfigServiceImpl).inSingletonScope();
    container.bind(TOKENS.storageService).toInstance(StorageServiceImpl).inSingletonScope();

    bindMiddlewares(container);
    bindCommands(container);

    injected(Bot, TOKENS.configService, TOKENS.commands.all, TOKENS.middlewares.all);
    container.bind(TOKENS.bot).toInstance(Bot).inSingletonScope();

    return container;
}
