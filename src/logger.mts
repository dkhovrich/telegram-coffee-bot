import bunyan from "bunyan";
import { LoggingBunyan } from "@google-cloud/logging-bunyan";

const isProduction = process.env["NODE_ENV"] === "production";
const isWebHook = process.env["BOT_MODE"] !== "server";

export function createLogger(name: string) {
    const logger = bunyan.createLogger({
        name,
        streams: [{ stream: process.stdout, level: "info" }]
    });
    if (isProduction && isWebHook) {
        const loggingBunyan = new LoggingBunyan();
        logger.addStream(loggingBunyan.stream("info"));
    }
    return logger;
}
