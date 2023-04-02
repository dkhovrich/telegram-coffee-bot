import { Container, Factory, injected, token } from "brandi";
import { ConfigService, ConfigServiceDevImpl, ConfigServiceProdImpl } from "./services/config.service.mjs";
import { Bot } from "./bot/bot.mjs";
import { StartCommand } from "./bot/commands/start.command.mjs";
import { Command } from "./bot/commands/command.mjs";
import { Middleware } from "./bot/middlewares/middleware.types.mjs";
import { SessionMiddleware } from "./bot/middlewares/session.middleware.mjs";
import { AuthMiddleware } from "./bot/middlewares/auth.middleware.mjs";
import { AddCommand } from "./bot/commands/add.command.mjs";
import { RecycleCommand } from "./bot/commands/recycle.command.mjs";
import { BalanceCommand } from "./bot/commands/balance.command.mjs";
import { StorageRepository, StorageService } from "./storage/storage.types.mjs";
import { StorageServiceImpl } from "./storage/storage.service.mjs";
import { StorageRepositoryFirebase } from "./storage/storage.repository.firebase.mjs";
import { StorageRepositorySql } from "./storage/storage.repository.sql.mjs";
import { UsersService, UsersServiceImpl } from "./services/users.service.mjs";
import { NotificationService, NotificationServiceImpl } from "./services/notification.service.mjs";
import { Context, Telegraf } from "telegraf";
import { IBaseBot } from "./bot/bot.base.mjs";

type BotFactory<T> = Factory<T, [bot: Telegraf<Context>]>;

export const TOKENS = {
    configService: token<ConfigService>("config.service"),
    usersService: token<UsersService>("users.service"),
    notificationService: token<BotFactory<NotificationService>>("notification.service"),
    bot: token<Bot>("bot.instance"),
    storageRepository: token<StorageRepository>("storage.repository"),
    storageService: token<StorageService>("storage"),
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
        all: token<Factory<Command[], [bot: Telegraf<Context>]>>("commands")
    }
};

function setBot(instance: IBaseBot, bot: Telegraf<Context>): void {
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

    injected(AddCommand, TOKENS.storageService, TOKENS.notificationService);
    container.bind(TOKENS.commands.add).toFactory(AddCommand, setBot);

    injected(RecycleCommand, TOKENS.storageService, TOKENS.notificationService);
    container.bind(TOKENS.commands.recycle).toFactory(RecycleCommand, setBot);

    injected(BalanceCommand, TOKENS.storageService);
    container.bind(TOKENS.commands.balance).toFactory(BalanceCommand, setBot);

    container.bind(TOKENS.commands.all).toConstant(bot => {
        const commands = [TOKENS.commands.start, TOKENS.commands.add, TOKENS.commands.recycle, TOKENS.commands.balance];
        return commands.map(token => container.get(token)(bot));
    });
}

export function createContainer(): Container {
    const container = new Container();

    container
        .bind(TOKENS.configService)
        .toInstance(process.env["NODE_ENV"] === "development" ? ConfigServiceDevImpl : ConfigServiceProdImpl)
        .inSingletonScope();

    injected(UsersServiceImpl, TOKENS.configService);
    container.bind(TOKENS.usersService).toInstance(UsersServiceImpl).inSingletonScope();

    injected(NotificationServiceImpl, TOKENS.usersService);
    container.bind(TOKENS.notificationService).toFactory(NotificationServiceImpl, setBot);

    if (process.env["STORAGE_TYPE"] === "sql") {
        injected(StorageRepositorySql, TOKENS.configService);
        container.bind(TOKENS.storageRepository).toInstance(StorageRepositorySql).inSingletonScope();
    } else {
        injected(StorageRepositoryFirebase, TOKENS.configService);
        container.bind(TOKENS.storageRepository).toInstance(StorageRepositoryFirebase).inSingletonScope();
    }

    injected(StorageServiceImpl, TOKENS.storageRepository);
    container.bind(TOKENS.storageService).toInstance(StorageServiceImpl).inSingletonScope();

    bindMiddlewares(container);
    bindCommands(container);

    injected(Bot, TOKENS.commands.all, TOKENS.configService, TOKENS.storageService, TOKENS.middlewares.all);
    container.bind(TOKENS.bot).toInstance(Bot).inSingletonScope();

    return container;
}
