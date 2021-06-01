import { Credentials } from "../typing";
import { MalformedBasicAuthorizationError } from "../errors";
import { baseParse } from "@lindorm-io/core";
import { includes } from "lodash";

export const getCredentials = (value: string): Credentials => {
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
