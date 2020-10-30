import { baseHash } from "@lindorm-io/common";
import { basicAuthMiddleware } from "./basic-auth-middleware";

describe("basic-auth-middleware.ts", () => {
  let options: any;
  let ctx: any;
  let next: any;

  beforeEach(() => {
    options = {
      username: "mock-username",
      password: "mock-password",
    };
    ctx = {
      get: jest.fn(),
      logger: {
        debug: jest.fn(),
      },
      metrics: {},
    };
    next = () => Promise.resolve();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully validate basic auth", async () => {
    ctx.get = jest.fn(() => `Basic ${baseHash("mock-username:mock-password")}`);

    await expect(basicAuthMiddleware(options)(ctx, next)).resolves.toBe(undefined);
  });

  test("should throw error on missing authorization header", async () => {
    ctx.get = jest.fn(() => undefined);

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toStrictEqual(
      expect.objectContaining({
        message: "Missing Authorization Header",
      }),
    );
  });

  test("should throw error on missing Basic Auth", async () => {
    ctx.get = jest.fn(() => "Bearer TOKEN");

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toStrictEqual(
      expect.objectContaining({
        message: "Invalid Authorization Header",
      }),
    );
  });

  test("should throw error on malformed basic auth formatting", async () => {
    ctx.get = jest.fn(() => `Basic ${baseHash("string-without-any-colon")}`);

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toStrictEqual(
      expect.objectContaining({
        message: "Malformed Basic Authorization",
      }),
    );
  });

  test("should throw error on wrong basic auth", async () => {
    ctx.get = jest.fn(() => `Basic ${baseHash("wrong-username:wrong-password")}`);

    await expect(basicAuthMiddleware(options)(ctx, next)).rejects.toStrictEqual(
      expect.objectContaining({
        message: "Invalid Basic Authorization",
      }),
    );
  });
});
