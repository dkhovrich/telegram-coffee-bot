import { createContainer, TOKENS } from "./composition-root.mjs";
import { initLocalization } from "./localization/localization.mjs";

console.log(`Starting in ${process.env["NODE_ENV"]} mode`);

await initLocalization();
const container = createContainer();
const bot = container.get(TOKENS.bot);
await bot.init();
