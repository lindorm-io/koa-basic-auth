import { IKoaAppContext } from "@lindorm-io/koa";

export type TNext = () => Promise<void>;

export type IBasicAuthContext = IKoaAppContext;

export interface IBasicAuthCredentials {
  username: string;
  password: string;
}

export interface IBasicAuthMiddlewareOptions {
  clients?: Array<IBasicAuthCredentials>;
}
