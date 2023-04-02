import { init } from "i18next";
import translation from "./translation.json" assert { type: "json" };

export async function initLocalization(): Promise<void> {
    await init({
        lng: "en",
        fallbackLng: "en",
        resources: { en: { translation: translation } }
    });
}
