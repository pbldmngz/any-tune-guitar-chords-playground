jest.mock("identity-obj-proxy", () => new Proxy({}, { get: () => () => "" }));
