import config from "config";

interface SqlConfig {
    host: string;
    user: string;
    password: string;
    database: string;
}

export type ConfigService = ReturnType<typeof createConfigService>;

export const createConfigService = () => ({
    token: config.get<string>("token"),
    userIds: config.get<number[]>("userIds"),
    sql: config.get<SqlConfig>("sql"),
    firebaseDatabaseUrl: config.get<string>("firebaseDatabaseUrl")
});
