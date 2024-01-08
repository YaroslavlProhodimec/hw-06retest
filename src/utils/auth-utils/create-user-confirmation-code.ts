import crypto from "crypto";

export const createConfirmationCode = (): string => {
  return crypto.randomUUID();
};
