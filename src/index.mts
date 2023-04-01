import { createContainer, TOKENS } from "./composition-root.mjs";

const container = createContainer();
const bot = container.get(TOKENS.bot.instance);
await bot.init();
