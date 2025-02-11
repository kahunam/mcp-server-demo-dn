import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

interface StockResponse {
  [key: string]: any;
}

// First let's define the server 
const server = new Server({
  name: "mcp-server-demo-1",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {
    }
  }
});

// Let's define our tools that we want the LLM to be able to call 
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: [{
    name: "get_stock_information",
    description: "Returns information about a Stock. Including it's price and other information like trading volume.",
    inputSchema: {
      type: "object",
      properties: {
        stockTicker: { type: "string" }
      },
      required: ["stockTicker"]
    }
  }]
 };
});

// Now let's define what will happen when we call each tool 
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Add your tools in here
  if (request.params.name === "get_stock_information") {
    const args = request.params.arguments as { stockTicker: string };
    if (!args?.stockTicker) {
      throw new McpError(ErrorCode.InvalidParams, "stockTicker is required");
    }
    
    try {
      const result = await makeRapidApiRequest(args.stockTicker);
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
            text: `Error fetching stock information: ${errorMessage}`
          }
        ]
      };
    }
  }
  // You could add more resources here by adding more if statements 
  
  throw new McpError(ErrorCode.MethodNotFound, "Tool not found");

});

// API Request Function
async function makeRapidApiRequest(stockTicker: string): Promise<StockResponse> {
  const url = new URL('https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules');
  url.searchParams.append('ticker', stockTicker);
  url.searchParams.append('module', 'statistics');

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json() as StockResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch stock information');
  }
}

// Run our server 
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Stock Information MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});


/** Add your configuration to your MCP configuration file 

"stock": {
  "command": "node",
  "args": ["users/mcp-servers/mcp-server-demo-1/build/demo.js"],
  "env": {
    "RAPIDAPI_KEY": "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX"
  },
  "disabled": false,
  "autoApprove": []
}

Quit and restart your chosen chat client and then test it out! */