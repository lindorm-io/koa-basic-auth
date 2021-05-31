export interface IBasicAuthCredentials {
  username: string;
  password: string;
}

export interface IBasicAuthMiddlewareOptions {
  clients?: Array<IBasicAuthCredentials>;
}
