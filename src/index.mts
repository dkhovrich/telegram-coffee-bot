import { createContainer, TOKENS } from "./composition-root.mjs";
import { initLocalization } from "./localization/localization.mjs";

await initLocalization();
const container = createContainer();
const bot = container.get(TOKENS.bot);
await bot.init();
