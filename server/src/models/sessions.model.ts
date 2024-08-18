import { REFRESH_TOKEN_EXPIRY } from '@constants';
import { Document, model, Schema, Types } from 'mongoose';

export interface SessionDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

const SessionSchema = new Schema({
  userId: {
    ref: 'User',
    type: Schema.Types.ObjectId,
    index: true,
  },
  userAgent: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: {
    type: Date,
    default: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
  },
});

export const SessionModel = model<SessionDocument>('Session', SessionSchema);
