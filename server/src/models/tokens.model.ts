import { model, Types, Schema, Document } from "mongoose";

export interface TokenDocument extends Document {
  userId: Types.ObjectId;
  type: string;
  expiresAt: Date;
  createdAt: Date;
}

const TokenSchema = new Schema({
  userId: {
    ref: "User",
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true },
});

export const TokenModel = model<TokenDocument>("Token", TokenSchema);
