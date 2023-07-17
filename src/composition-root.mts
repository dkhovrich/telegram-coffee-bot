import { Container, Factory, injected, token } from "brandi";
import { Config, createConfigService } from "./config.mjs";
import { BotServer } from "./bot/bot.server.mjs";
import { StartCommand } from "./bot/commands/start.command.mjs";
import { Command } from "./bot/commands/command.mjs";
import { Middleware } from "./bot/middlewares/middleware.types.mjs";
import { SessionMiddleware } from "./bot/middlewares/session.middleware.mjs";
import { AuthMiddleware } from "./bot/middlewares/auth.middleware.mjs";
import { AddCommand } from "./bot/commands/add.command.mjs";
import { RecycleCommand } from "./bot/commands/recycle.command.mjs";
import { BalanceCommand } from "./bot/commands/balance.command.mjs";
import { Storage } from "./storage/storage.types.mjs";
import { CapsulesService, CapsulesServiceImpl } from "./services/capsules.service.mjs";
import { StorageFirebase } from "./storage/storage.firebase.mjs";
import { UsersService, UsersServiceImpl } from "./services/users.service.mjs";
import { NotificationService, NotificationServiceImpl } from "./services/notification.service.mjs";
import { IBaseBot } from "./bot/bot.base.mjs";
import { TelegrafBot } from "./bot/types.mjs";
import { BotWebhook } from "./bot/bot.webhook.mjs";
import { IBot } from "./bot/bot.mjs";
import { LoggerFactory, LoggerFactoryImpl } from "./logger/logger.factory.mjs";
import { StorageStub } from "./storage/storage.stub.mjs";

type BotFactory<T> = Factory<T, [bot: TelegrafBot]>;

export const TOKENS = {
    config: token<Config>("config"),
    loggerFactory: token<LoggerFactory>("logger.factory"),
    usersService: token<UsersService>("users.service"),
    notificationService: token<BotFactory<NotificationService>>("notification.service"),
    bot: token<IBot>("bot"),
    storage: token<Storage>("storage"),
    capsulesService: token<CapsulesService>("capsules.service"),
    middlewares: {
        session: token<Middleware>("middleware.session"),
        auth: token<Middleware>("middleware.auth"),
        all: token<Middleware[]>("middlewares")
    },
    commands: {
        start: token<BotFactory<Command>>("command.start"),
        add: token<BotFactory<Command>>("command.add"),
        recycle: token<BotFactory<Command>>("command.recycle"),
        balance: token<BotFactory<Command>>("command.balance"),
        all: token<Factory<Command[], [bot: TelegrafBot]>>("commands")
    }
};

function setBot(instance: IBaseBot, bot: TelegrafBot): void {
    instance.setBot(bot);
}

function bindMiddlewares(container: Container): void {
    injected(AuthMiddleware, TOKENS.usersService);
    container.bind(TOKENS.middlewares.auth).toInstance(AuthMiddleware).inSingletonScope();
    container.bind(TOKENS.middlewares.session).toInstance(SessionMiddleware).inSingletonScope();
    container
        .bind(TOKENS.middlewares.all)
        .toConstant([TOKENS.middlewares.auth, TOKENS.middlewares.session].map(token => container.get(token)));
}

function bindCommands(container: Container): void {
    container.bind(TOKENS.commands.start).toFactory(StartCommand, setBot);

    injected(AddCommand, TOKENS.capsulesService, TOKENS.notificationService);
    container.bind(TOKENS.commands.add).toFactory(AddCommand, setBot);

    injected(RecycleCommand, TOKENS.capsulesService, TOKENS.notificationService);
    container.bind(TOKENS.commands.recycle).toFactory(RecycleCommand, setBot);

    injected(BalanceCommand, TOKENS.capsulesService);
    container.bind(TOKENS.commands.balance).toFactory(BalanceCommand, setBot);

    container.bind(TOKENS.commands.all).toConstant(bot => {
        const commands = [TOKENS.commands.start, TOKENS.commands.add, TOKENS.commands.recycle, TOKENS.commands.balance];
        return commands.map(token => container.get(token)(bot));
    });
}

export function createContainer(): Container {
    const container = new Container();

    container.bind(TOKENS.config).toInstance(createConfigService).inSingletonScope();

    injected(LoggerFactoryImpl, TOKENS.config);
    container.bind(TOKENS.loggerFactory).toInstance(LoggerFactoryImpl).inSingletonScope();

    injected(UsersServiceImpl, TOKENS.config);
    container.bind(TOKENS.usersService).toInstance(UsersServiceImpl).inSingletonScope();

    injected(NotificationServiceImpl, TOKENS.usersService);
    container.bind(TOKENS.notificationService).toFactory(NotificationServiceImpl, setBot);

    if (process.env["STORAGE"] === "stub") {
        container.bind(TOKENS.storage).toInstance(StorageStub).inSingletonScope();
    } else {
        injected(StorageFirebase, TOKENS.config);
        container.bind(TOKENS.storage).toInstance(StorageFirebase).inSingletonScope();
    }

    injected(CapsulesServiceImpl, TOKENS.storage);
    container.bind(TOKENS.capsulesService).toInstance(CapsulesServiceImpl).inSingletonScope();

    bindMiddlewares(container);
    bindCommands(container);

    const botDependencies = [TOKENS.config, TOKENS.loggerFactory, TOKENS.commands.all, TOKENS.middlewares.all] as const;
    if (process.env["BOT_MODE"] === "server") {
        injected(BotServer, ...botDependencies);
        container.bind(TOKENS.bot).toInstance(BotServer).inSingletonScope();
    } else {
        injected(BotWebhook, ...botDependencies);
        container.bind(TOKENS.bot).toInstance(BotWebhook).inSingletonScope();
    }

    return container;
}
