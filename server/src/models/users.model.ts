import { model, Schema, Document, Types } from "mongoose";
import { hashValue, verifyValue } from "@utils/argon2";

export interface UserDocument extends Document {
  _id: Types.ObjectId,
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  verifyPassword(val: string): Promise<boolean>;
  omitPassword(): Pick<
    UserDocument,
    "_id" | "fullName" | "email" | "createdAt" | "updatedAt" | "__v"
  >;
}

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hashValue(this.password);
  next();
});

UserSchema.methods.verifyPassword = async function (val: string) {
  return verifyValue(val, this.password);
};

UserSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const UserModel = model<UserDocument>("User", UserSchema);
