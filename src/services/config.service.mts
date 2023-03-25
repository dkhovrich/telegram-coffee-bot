import { config, DotenvParseOutput } from "dotenv";
import { assert } from "../utils/assert.mjs";

export interface ConfigService {
    get(key: string): string;
}

export class ConfigServiceImpl implements ConfigService {
    private readonly config: DotenvParseOutput;

    public constructor() {
        const { error, parsed } = config();
        assert(error == null, "Error loading .env file");
        assert(parsed != null, "Empty .env file");

        this.config = parsed;
    }

    public get(key: string): string {
        const result = this.config[key];
        assert(result != null, `Missing environment variable: ${key}`);
        return result;
    }
}
