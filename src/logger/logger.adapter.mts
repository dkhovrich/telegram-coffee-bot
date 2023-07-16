import bunyan from "bunyan";
import { Logger } from "./types.mjs";

export class LoggerAdapter implements Logger {
    public constructor(private readonly logger: bunyan) {}

    public info(message: string, args: Object = {}): void {
        this.logger.info(args, message);
    }

    public error(message: string, args: Object = {}): void {
        this.logger.error(args, message);
    }
}
