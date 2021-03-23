import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class InvalidServerSettingsError extends APIError {
  constructor(clients: any) {
    super("Invalid Server Settings", {
      details: "The Clients object does not exist",
      debug: { clients },
      statusCode: HttpStatus.ServerError.NOT_IMPLEMENTED,
    });
  }
}
