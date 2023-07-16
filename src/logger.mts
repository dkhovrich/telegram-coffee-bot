import bunyan from "bunyan";

export function createLogger(name: string) {
    return bunyan.createLogger({
        name,
        streams: [{ stream: process.stdout, level: "info" }]
    });
}
