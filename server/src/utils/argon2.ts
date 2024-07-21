import argon2 from "argon2";

export const hashValue = async (value: string) => argon2.hash(value);

export const verifyValue = async (hashed: string, value: string) =>
  argon2.verify(hashed, value).catch(() => false);
