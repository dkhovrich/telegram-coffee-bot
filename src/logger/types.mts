type LogMethod = (message: string, args?: Object) => void;

export interface Logger {
    info: LogMethod;
    error: LogMethod;
}
