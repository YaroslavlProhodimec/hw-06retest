import { LoginSuccessViewModel } from "../../dto/authDTO/authDTO";

export const createAccessTokenModel = (
  token: string
): LoginSuccessViewModel => {
  return {
    accessToken: token,
  };
};
