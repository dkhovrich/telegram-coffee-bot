import { z } from "zod";
import { config } from "dotenv";
import { assert } from "../utils/assert.mjs";

const envSchema = z.object({
    TOKEN: z.string(),
    USER_IDS: z.string(),
    SQL_DATABASE_HOST: z.string(),
    SQL_DATABASE_USER: z.string(),
    SQL_DATABASE_PASSWORD: z.string(),
    SQL_DATABASE_NAME: z.string(),
    FIREBASE_DATABASE_URL: z.string()
});

export type Env = z.infer<typeof envSchema>;

function loadDevConfig(): Record<string, string> {
    const { error, parsed } = config();
    assert(error == null, "Error loading .env file");
    assert(parsed != null, "Empty .env file");

    return parsed;
}

export interface ConfigService {
    get(key: keyof Env): string;
}

export class ConfigServiceImpl implements ConfigService {
    private readonly env: Env;

    public constructor() {
        const env = process.env["NODE_ENV"] === "development" ? loadDevConfig() : process.env;
        this.env = envSchema.parse(env);
    }

    public get(key: keyof Env): string {
        return this.env[key];
    }
}
