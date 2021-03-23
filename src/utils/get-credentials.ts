import { MalformedBasicAuthorizationError } from "../errors";
import { baseParse } from "@lindorm-io/core";
import { includes } from "lodash";

export interface IGetCredentialsData {
  username: string;
  password: string;
}

export const getCredentials = (value: string): IGetCredentialsData => {
  const credentials = baseParse(value);

  if (!includes(credentials, ":")) {
    throw new MalformedBasicAuthorizationError();
  }

  const [username, password] = credentials.split(":");

  return {
    username,
    password,
  };
};
