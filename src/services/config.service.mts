import { config } from "dotenv";
import { assert } from "../utils/assert.mjs";

export interface ConfigService {
    get(key: string): string;
}

abstract class BaseConfigService implements ConfigService {
    protected constructor(private readonly config: Record<string, string | undefined>) {}

    public get(key: string): string {
        const result = this.config[key];
        assert(result != null, `Missing environment variable: ${key}`);
        return result;
    }
}

export class ConfigServiceDevImpl extends BaseConfigService {
    public constructor() {
        console.log("Create development configuration");

        const { error, parsed } = config();
        assert(error == null, "Error loading .env file");
        assert(parsed != null, "Empty .env file");

        super(parsed);
    }
}

export class ConfigServiceProdImpl extends BaseConfigService {
    public constructor() {
        console.log("Create production configuration");
        super(process.env);
    }
}
