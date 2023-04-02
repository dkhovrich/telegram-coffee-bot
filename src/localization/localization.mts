import i18next from "i18next";
import translation from "./translation.json" assert { type: "json" };

export async function initLocalization(): Promise<void> {
    await i18next.init({
        lng: "en",
        fallbackLng: "en",
        resources: { en: { translation: translation } }
    });
}
