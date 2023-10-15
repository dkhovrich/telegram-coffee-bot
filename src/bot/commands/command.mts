import { BaseBot } from "../bot.base.mjs";
import { NotificationService } from "../../services/notification.service.mjs";
import { BotFactory } from "../bot.types.mjs";

export abstract class Command extends BaseBot {
    private _notificationService: NotificationService | null = null;

    public constructor(private readonly notificationServiceFactory: BotFactory<NotificationService>) {
        super();
    }

    public get notificationService(): NotificationService {
        if (this._notificationService == null) {
            this._notificationService = this.notificationServiceFactory(this.bot);
        }
        return this._notificationService;
    }

    public abstract handle(): void;
}
