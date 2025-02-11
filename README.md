# MCP Server Coding Demo Guide

## Step 1: Clone the Repository

1. Create a folder on your device where you'll store your MCP servers to stay organized.
2. Clone the repository into that folder.
   - Repository Link: *(to be added later)*

## Step 2: Review the Source Files

- Navigate to the `src` folder and review the following files:
  - **`index.ts`**: A basic template server that requires modifications.
  - **`demo.ts`**: A functional example that demonstrates an API integration.

## Step 3: Select an API

1. Go to [RapidAPI](https://rapidapi.com/) and find an API and endpoint to use.
2. Get access and your autorization key. Review the example output to understand how the request should be structured.
3. Ensure you retrieve the correct headers, authorization details, and request parameters.

**Note:** Suggested to use an API with good ratings and clear output. To be sure that it's reliable.

## Step 4: Configure Your Demo

1. **Define the server name** - choose something which will be easy for you or an end user to recognise.
2. **Define Your Tool**: Choose a name that makes sense for your use case. Collect parameters, and mark them as required if they are needed.
3. **Configure the Resource**:
   - Ensure the API is properly called. Configure your authorization headers and endpoint url.
   - Pass the correct data in with the request.
   - Note - handle authentication correctly (either within the MCP configuration or a `.env` file).

## Step 5: Install and Build

1. Install dependencies if not already installed:
   ```bash
   npm install
   npm run build
   ```

## Step 6: Configure Your Chat App

1. Use the example configuration as your base and edit the following:
   - Build path to match your build file location.
   - Set an appropriate tool name.
   - Ensure the command is correct.
   - Insert your API key as an ENV value.
2. Save the configuration file for your cloud desktop or 5ier setup.
- ~/Library/Application Support
3. Restart the chat application to apply the changes.

```json
{
  "stock": {
    "command": "node",
    "args": ["users/mcp-servers/mcp-server-demo-1/build/demo.js"],
    "env": {
      "RAPIDAPI_KEY": "XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX-XXX"
    },
    "disabled": false,
    "autoApprove": []
  }
}
```

## Step 8: Test Your Setup

- Launch a chat and verify that your server is working as expected.

## Debugging and Troubleshooting

- [Commands and methods.](https://modelcontextprotocol.io/docs/tools/debugging)

## Help!

Setting up MCP on Claude Desktop (user guide)  
https://modelcontextprotocol.io/quickstart/user

Making an MCP server quickstart guide (dev guide)  
https://modelcontextprotocol.io/quickstart/server

MCP 101 and building an MCP Server  
https://glama.ai/blog/2024-11-25-model-context-protocol-quickstart

TS MCP SDK  
https://github.com/modelcontextprotocol/typescript-sdk

5ire - How to add MCP to 5ire
- Open the application support folder and edit the MCP config file.  
  https://5ire.app/docs

## Not feeling confident with the code? - Consider the Cline Way

- Install Cline on VS Code. https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev
- Add your API key to Cline
- Select a capable model (Claude3.5, Deepseek, Gpt4o or Gemini Pro)
- Create a new directory and instruct cline to build you an MCP server.
- You can use the sample prompt included in the repo.

## Additional Notes

- Links to specific debugging resources and chat app configurations will be added.
- MCP servers can be deployed and tested directly within Klein.
