import config from "config";

export type SqlConfig = {
    host: string;
    user: string;
    password: string;
    database: string;
};

export type FirebaseConfig = {
    credential: {
        type: string;
        project_id: string;
        private_key_id: string;
        private_key: string;
        client_email: string;
        client_id: string;
        auth_uri: string;
        token_uri: string;
        auth_provider_x509_cert_url: string;
        client_x509_cert_url: string;
    };
    databaseURL: string;
};

export type ConfigService = ReturnType<typeof createConfigService>;

export const createConfigService = () => ({
    token: config.get<string>("token"),
    userIds: config.get<number[]>("userIds"),
    sql: config.get<SqlConfig>("sql"),
    firebase: config.get<FirebaseConfig>("firebase")
});
