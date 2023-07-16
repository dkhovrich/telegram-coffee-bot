import { createContainer, TOKENS } from "./composition-root.mjs";
import { initLocalization } from "./localization/localization.mjs";
import { createLogger } from "./logger.mjs";

const logger = createLogger("index");
logger.info("Starting...", { mode: process.env["NODE_ENV"] });

await initLocalization();
const container = createContainer();
const bot = container.get(TOKENS.bot);
await bot.init();
await bot.start();
