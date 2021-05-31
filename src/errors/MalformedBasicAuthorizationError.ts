import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class MalformedBasicAuthorizationError extends APIError {
  public constructor() {
    super("Malformed Basic Authorization", {
      details: "The provided basic auth string does not contain a username and password",
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
