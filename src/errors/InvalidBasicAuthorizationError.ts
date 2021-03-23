import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class InvalidBasicAuthorizationError extends APIError {
  constructor() {
    super("Invalid Basic Authorization", {
      details: "The provided basic auth string does not match the expected",
      statusCode: HttpStatus.ClientError.FORBIDDEN,
    });
  }
}
