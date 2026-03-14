'use server';

import { getSettings } from "../services/getSettings";

export interface GetSettingsActionResponse {
  introVideoLink: string
  marqueeText: string
  theme: string
}

const getSettingsAction = async (): Promise<GetSettingsActionResponse> => {
  try {
    const settings = await getSettings();

    return settings;
  } catch (error) {
    console.error("Error in getSettingsAction:", error);
    return {
      introVideoLink: "",
      marqueeText: "",
      theme: "default",
    };
  }
};

export default getSettingsAction;
