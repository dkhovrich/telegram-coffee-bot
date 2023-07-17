import { createContainer, TOKENS } from "./composition-root.mjs";
import { initLocalization } from "./localization/localization.mjs";

const container = createContainer();
const logger = container.get(TOKENS.loggerFactory).create("index");

const { isProduction, isStorageStub, isGoogleCloudEnvironment } = container.get(TOKENS.config);
logger.info("Starting...", { isProduction, isStorageStub, isGoogleCloudEnvironment });

await initLocalization();
const bot = container.get(TOKENS.bot);
await bot.init();
await bot.start();
