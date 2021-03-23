import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class InvalidAuthorizationHeaderError extends APIError {
  constructor() {
    super("Invalid Authorization Header", {
      details: "Expected header to be: Basic",
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
