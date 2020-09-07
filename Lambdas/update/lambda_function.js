// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE;
const website = process.env.WEBSITE;

// Create a DocumentClient that represents the query to add an item
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
exports.lambdaHandler = async (event, context) => {
  if (event.httpMethod !== "PUT") {
    throw new Error(
      `putMethod only accept Put method, you tried: ${event.httpMethod}`
    );
  }
  console.info("received:", event);

  var params = {
    TableName: process.env.TABLE,
    Key: { website: process.env.WEBSITE },
    UpdateExpression: "add accessedValue :val",
    ExpressionAttributeValues: { ":val": 1 },
    ReturnValues: "ALL_NEW",
  };

  let data = "";
  try {
    data = await dynamo.update(params, data).promise();
    const response = {
      statusCode: 200,
      body: JSON.stringify(data.Attributes),
      headers: {"Access-Control-Allow-Origin": "*"}
    };

    // All log statements are written to CloudWatch
    console.info(
      `response from: ${event.path} statusCode: ${response.statusCode} body: ${JSON.stringify(data.Attributes)}`
    );
    return response;
  } catch (error) {
    console.log(error);
    return { statusCode: 400, body: JSON.stringify(error),headers: {"Access-Control-Allow-Origin": "*"} };
  }
};
