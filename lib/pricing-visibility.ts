import { GetSettingsActionResponse } from "@/app/Actions/get-settings"

export const canShowPricingForVisitor = (
  settings: Pick<GetSettingsActionResponse, "showPricing">
): boolean => {
  return Boolean(settings.showPricing)
}

export const canAccessPricingPageForVisitor = (
  settings: Pick<GetSettingsActionResponse, "showPricing" | "enablePricingPage">
): boolean => {
  return Boolean(settings.enablePricingPage && settings.showPricing)
}
