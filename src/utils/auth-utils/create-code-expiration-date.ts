import { add } from "date-fns";

export const createCodeExpirationDate = () => {
  return add(new Date(new Date().setHours(new Date().getHours() + 3)), {
    days: 1,
  }).toISOString();
};
