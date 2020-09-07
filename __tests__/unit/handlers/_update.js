// Import function
const lambda = require("../../../Lambdas/update/lambda_function");
// Import dynamodb from aws-sdk
const dynamodb = require("aws-sdk/clients/dynamodb");

// This includes all tests for update.lambda_function
describe("Test getByIdHandler", () => {
  let getSpy;

  beforeAll(() => {
    // Mock dynamodb put methods
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

  // This test invokes update.lambda_function and compares the result **** WIll fail after first pass because the
  // accessedValue state has changed. Change accessedValue in item to match what should come back
  it("should update item and return updated values", async () => {
    const item = { accessedValue: 1, website: "grid" };

    // Return the specified value whenever the spied put function is called
    getSpy.mockReturnValue({
      promise: () => Promise.resolve({ Item: item }),
    });

    const event = {
      httpMethod: "PUT",
    };

    // Invoke update.lambda_function
    const result = await lambda.lambdaHandler(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(item),
    };

    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
