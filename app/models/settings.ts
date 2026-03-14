import { Schema, model, models, Document } from "mongoose"
import { Theme } from "@/Enums"

export interface ISettings extends Document {
  introVideoLink: string
  marqueeText: string
  theme: string
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
});

export default models?.Settings || model<ISettings>("Settings", SettingsSchema);
