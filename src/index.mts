import { createContainer, TOKENS } from "./composition-root.mjs";
import { initLocalization } from "./localization/localization.mjs";

const container = createContainer();
const logger = container.get(TOKENS.loggerFactory).create("index");

const { isProduction } = container.get(TOKENS.config);
logger.info("Starting...", { isProduction });

await initLocalization();
const bot = container.get(TOKENS.bot);
await bot.init();
await bot.start();
