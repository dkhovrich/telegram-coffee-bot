import config from "config";
import { z } from "zod";

const configSchema = z.object({
    token: z.string(),
    userIds: z.number().array(),
    sql: z.object({
        host: z.string(),
        user: z.string(),
        password: z.string(),
        database: z.string()
    }),
    firebase: z.object({
        credential: z.object({
            type: z.string(),
            project_id: z.string(),
            private_key_id: z.string(),
            private_key: z.string(),
            client_email: z.string(),
            client_id: z.string(),
            auth_uri: z.string(),
            token_uri: z.string(),
            auth_provider_x509_cert_url: z.string(),
            client_x509_cert_url: z.string()
        }),
        databaseURL: z.string()
    })
});

export type ConfigService = z.infer<typeof configSchema>;

export function createConfigService(): ConfigService {
    return configSchema.parse({
        token: config.get("token"),
        userIds: config.get("userIds"),
        sql: config.get("sql"),
        firebase: config.get("firebase")
    });
}
