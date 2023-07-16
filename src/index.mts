import { createContainer, TOKENS } from "./composition-root.mjs";
import { initLocalization } from "./localization/localization.mjs";
import { createLogger } from "./logger.mjs";

const container = createContainer();
const logger = createLogger("index");

const { isProduction } = container.get(TOKENS.config);
logger.info("Starting...", { isProduction });

await initLocalization();
const bot = container.get(TOKENS.bot);
await bot.init();
await bot.start();
