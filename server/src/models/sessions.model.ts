import { model, Types, Schema, Document } from "mongoose";

export interface SessionDocument extends Document {
  _id: Types.ObjectId
  userId: Types.ObjectId;
  createdAt: Date;
  expiresAt: Date;
}

const SessionSchema = new Schema({
  userId: {
    ref: "User",
    type: Schema.Types.ObjectId,
    index: true,
  },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: {
    type: Date,
    default: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  },
});

export const SessionModel = model<SessionDocument>("Session", SessionSchema);
