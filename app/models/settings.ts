import { Schema, model, models, Document } from "mongoose"
import { Theme } from "@/Enums"

export interface ISettings extends Document {
  introVideoLink: string
  marqueeText: string
  theme: string
  showPricing: boolean
  enablePricingPage: boolean
}

const SettingsSchema: Schema = new Schema({
  introVideoLink: {
    type: String,
    default: ""
  },
  marqueeText: {
    type: String,
    default: ""
  },
  theme: {
    type: String,
    enum: Object.values(Theme),
    default: Theme.DEFAULT,
  },
  showPricing: {
    type: Boolean,
    default: false,
  },
  enablePricingPage: {
    type: Boolean,
    default: false,
  },
});

export default models?.Settings || model<ISettings>("Settings", SettingsSchema);
