import { Credentials } from "../typing";
import { InvalidBasicAuthorizationError } from "../errors";
import { stringComparison } from "@lindorm-io/core";

const findClient = (username: string, clients: Array<Credentials>): Credentials => {
  for (const client of clients) {
    if (!stringComparison(username, client.username)) continue;
    return client;
  }

  throw new InvalidBasicAuthorizationError();
};

export const validateCredentials = (credentials: Credentials, clients: Array<Credentials>): void => {
  const client = findClient(credentials.username, clients);

  if (!stringComparison(client.password, credentials.password)) {
    throw new InvalidBasicAuthorizationError();
  }
};
