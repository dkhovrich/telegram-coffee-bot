import { Logger } from "./types.mjs";
import { Config } from "../config.mjs";
import bunyan from "bunyan";
import { LoggingBunyan } from "@google-cloud/logging-bunyan";
import { LoggerAdapter } from "./logger.adapter.mjs";

export interface LoggerFactory {
    create(name: string): Logger;
}

export class LoggerFactoryImpl implements LoggerFactory {
    private readonly shouldCreateGoogleCloudLogger: boolean;

    public constructor(config: Config) {
        this.shouldCreateGoogleCloudLogger = config.isProduction && config.isWebHook;
    }

    public create(name: string): Logger {
        const logger = bunyan.createLogger({
            name,
            streams: [{ stream: process.stdout, level: "info" }]
        });
        if (this.shouldCreateGoogleCloudLogger) {
            const loggingBunyan = new LoggingBunyan();
            logger.addStream(loggingBunyan.stream("info"));
        }
        return new LoggerAdapter(logger);
    }
}
