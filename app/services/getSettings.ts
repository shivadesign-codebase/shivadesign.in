import connect_db from '@/config/db'
import Settings from "@/app/models/settings";
import { GetSettingsActionResponse } from '../Actions/get-settings';

export const getSettings = async (): Promise<GetSettingsActionResponse> => {
  await connect_db();

  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    return {
      introVideoLink: settings?.introVideoLink || "",
      marqueeText: settings?.marqueeText || "",
      theme: settings?.theme || "default",
    };
  } catch (error) {
    console.error("Error fetching settings:", error)
    return {
      introVideoLink: "",
      marqueeText: "",
      theme: "default",
    };
  }
}
