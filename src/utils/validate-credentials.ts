import { IBasicAuthCredentials } from "../typing";
import { IGetCredentialsData } from "./get-credentials";
import { stringComparison } from "@lindorm-io/core";
import { InvalidBasicAuthorizationError } from "../errors";

const findClient = (username: string, clients: Array<IBasicAuthCredentials>): IBasicAuthCredentials => {
  for (const client of clients) {
    if (!stringComparison(username, client.username)) continue;
    return client;
  }

  throw new InvalidBasicAuthorizationError();
};

export const validateCredentials = (credentials: IGetCredentialsData, clients: Array<IBasicAuthCredentials>): void => {
  const client = findClient(credentials.username, clients);

  if (!stringComparison(client.password, credentials.password)) {
    throw new InvalidBasicAuthorizationError();
  }
};
