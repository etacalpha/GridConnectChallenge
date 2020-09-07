// Import all functions from get-by-id.js
const lambda = require("../../../Lambdas/update/lambda_function");
// Import dynamodb from aws-sdk
const dynamodb = require("aws-sdk/clients/dynamodb");

// This includes all tests for getByIdHandler()
describe("Test getByIdHandler", () => {
  let getSpy;

  beforeAll(() => {
    // Mock dynamodb get and put methods
    // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname
    getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, "put");
    process.env = Object.assign(process.env, {
      TABLE: "WebsiteViews",
      WEBSITE: "grid",
    });
  });

  // Clean up mocks
  afterAll(() => {
    getSpy.mockRestore();
  });

  // This test invokes getByIdHandler() and compare the result **** WIll fail after first pass because the
  // accessedValue state has changed. Change accessedValue in item to match what should come back
  it("should update item and return updated values", async () => {
    const item = { accessedValue: 1, website: "grid" };

    // Return the specified value whenever the spied get function is called
    getSpy.mockReturnValue({
      promise: () => Promise.resolve({ Item: item }),
    });

    const event = {
      httpMethod: "PUT",
    };

    // Invoke getByIdHandler()
    const result = await lambda.lambdaHandler(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(item),
    };

    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
