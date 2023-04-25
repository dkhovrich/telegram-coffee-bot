import config from "config";

interface SqlConfig {
    host: string;
    user: string;
    password: string;
    database: string;
}

export interface ConfigService {
    token: string;
    userIds: number[];
    sql: SqlConfig;
    firebaseDatabaseUrl: string;
}

export class ConfigServiceImpl implements ConfigService {
    get token(): string {
        return config.get("token");
    }

    get userIds(): number[] {
        return config.get("userIds");
    }

    get sql(): SqlConfig {
        return config.get<SqlConfig>("sql");
    }

    get firebaseDatabaseUrl(): string {
        return config.get("firebaseDatabaseUrl");
    }
}
