'use server';

import { getSettings } from "../services/getSettings";

export interface GetSettingsActionResponse {
  introVideoLink: string
  marqueeText: string
  theme: string
  showPricing: boolean
  enablePricingPage: boolean
}

const getSettingsAction = async (): Promise<GetSettingsActionResponse> => {
  return getSettings();
};

export default getSettingsAction;
