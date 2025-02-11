import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

interface ExampleResponse {
  [key: string]: any; // Example: Used for API response data like stock market information
}

/* First let's define the server */
const server = new Server({
  name: "example-mcp-server", // Example: "stock-server" or "weather-server"
  version: "1.0.0",
}, {
  capabilities: {
    tools: {
    }
  }
});

/* Let's define our tools that we want the LLM to be able to call */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: [{
    name: "get_data", // Example: "get_stock_information" or "get_weather_forecast"
    description: "Returns data from an external API", // Example: "Returns stock price and trading volume"
    inputSchema: {
      type: "object",
      properties: {
        parameter: { type: "string" } // Example: stockTicker: { type: "string" }. You can ask for multiple input parameters here.
      },
      required: ["parameter"] // Example: ["stockTicker"], put the parameters that are required here.
    }
  }]
 };
});

/* Now let's define what will happen when we call our tools */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_data") { // Example: "get_stock_information" or "get_weather_forecast"
    const args = request.params.arguments as { parameter: string }; // Example: { stockTicker: string }
    if (!args?.parameter) {
      throw new McpError(ErrorCode.InvalidParams, "parameter is required"); // Example: "Stock ticker is not defined"
    }
    
    try {
      const result = await makeApiRequest(args.parameter);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error fetching data: ${errorMessage}`
          }
        ]
      };
    }
  }
  
  throw new McpError(ErrorCode.MethodNotFound, "Tool not found");
});

async function makeApiRequest(parameter: string): Promise<ExampleResponse> {
  // Example API endpoint: 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules'
  const url = new URL('YOUR_API_ENDPOINT');
  
  // Example parameters:
  // url.searchParams.append('ticker', stockTicker);
  // url.searchParams.append('module', 'statistics');
  url.searchParams.append('param', parameter);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        // Example headers:
        // 'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        // 'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
        'Authorization': `Bearer ${process.env.API_KEY || ''}`
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json() as ExampleResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch data');
  }
}

/* A function to run our server */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio"); // Example: "Stock Information MCP Server running on stdio"
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

/* Install any required packages and run the build process */

/* Add your configuration to your MCP configuration file */
/* Example configuration:
{
  "your-server-name": {
    "command": "node",
    "args": ["path/to/your/built/server.js"],
    "env": {
      "API_KEY": "your-api-key-here"
    },
    "disabled": false,
    "autoApprove": []
  }
}
*/

/* Quit and restart your chosen chat client and then test it out! */
