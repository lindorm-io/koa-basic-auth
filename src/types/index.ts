import { IKoaAppContext } from "@lindorm-io/koa";

export type TNext = () => Promise<void>

export type IBasicAuthContext = IKoaAppContext

export interface IBasicAuthMiddlewareOptions {
  username: string;
  password: string;
}
