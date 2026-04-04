import connect_db from '@/config/db'
import Settings from "@/app/models/settings";
import { unstable_noStore as noStore } from "next/cache";
import { cache } from "react";
import { GetSettingsActionResponse } from '../Actions/get-settings';

const getSettingsFromDb = async (): Promise<GetSettingsActionResponse> => {
  // Ensure pages depending on settings are rendered dynamically with fresh DB data.
  noStore();
  await connect_db();

  try {
    let settings = await Settings.findOne().sort({ _id: -1 });

    if (!settings) {
      settings = await Settings.create({});
    }

    return {
      introVideoLink: settings?.introVideoLink || "",
      marqueeText: settings?.marqueeText || "",
      theme: settings?.theme || "default",
      showPricing: settings?.showPricing ?? false,
      enablePricingPage: settings?.enablePricingPage ?? false,
    };
  } catch (error) {
    console.error("Error fetching settings:", error)
    return {
      introVideoLink: "",
      marqueeText: "",
      theme: "default",
      showPricing: false,
      enablePricingPage: false,
    };
  }
}

// Deduplicate settings reads when multiple server components request settings in the same render.
export const getSettings = cache(getSettingsFromDb)
