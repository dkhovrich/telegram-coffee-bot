import config from "config";
import { z } from "zod";

const configSchema = z.object({
    token: z.string(),
    userIds: z.number().array(),
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
    }),
    isStorageStub: z.boolean(),
    isProduction: z.boolean(),
    isGoogleCloudEnvironment: z.boolean()
});

export type Config = z.infer<typeof configSchema>;

export function createConfigService(): Config {
    const configuration: Config = {
        token: config.get("token"),
        userIds: config.get("userIds"),
        firebase: config.get("firebase"),
        isStorageStub: process.env["STORAGE"] === "stub",
        isProduction: process.env["NODE_ENV"] === "production",
        isGoogleCloudEnvironment: process.env["ENVIRONMENT"] === "gcloud"
    };
    return configSchema.parse(configuration);
}
