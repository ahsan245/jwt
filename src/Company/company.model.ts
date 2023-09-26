/* eslint-disable prettier/prettier */
import { Schema, Document, model } from 'mongoose';

export interface Company extends Document {
  display_name: string;
  meta: string;
  version: string;
}

export const CompanySchema = new Schema({
  display_name: { type: String, required: true },
  meta: { type: String, required: true },
  version: { type: String, required: true },
});

export const CompanyModel = model<Company>('Company', CompanySchema);