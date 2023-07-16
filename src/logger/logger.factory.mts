import { Logger } from "./types.mjs";
import { Config } from "../config.mjs";
import bunyan, { Stream } from "bunyan";
import { LoggingBunyan } from "@google-cloud/logging-bunyan";
import { LoggerAdapter } from "./logger.adapter.mjs";

export interface LoggerFactory {
    create(name: string): Logger;
}

export class LoggerFactoryImpl implements LoggerFactory {
    public constructor(private readonly config: Config) {}

    public create(name: string): Logger {
        const logger = bunyan.createLogger({ name, streams: [this.createStream()] });
        return new LoggerAdapter(logger);
    }

    private createStream(): Stream {
        if (this.config.isProduction && this.config.isWebHook) {
            return new LoggingBunyan().stream("info");
        }
        return { stream: process.stdout, level: "info" };
    }
}
