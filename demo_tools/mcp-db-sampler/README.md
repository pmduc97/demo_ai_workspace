# MCP DB Sampler

A Model Context Protocol (MCP) server designed to help AI agents (like GitHub Copilot) sample real database data when generating test cases. This prevents the AI from hallucinating invalid foreign keys or unrealistic data formats.

## Features

Provides 4 tools to the AI:
1. `get_sample_data`: Fetch a few real rows from a table to understand the data format.
2. `get_valid_foreign_keys`: Fetch valid IDs from a parent table to use in test data.
3. `execute_read_query`: Execute a custom `SELECT` query to find specific test data (Read-Only).
4. `get_live_schema_info`: Get the live schema (columns, types) directly from PostgreSQL.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env` and update your PostgreSQL connection details.

## Integration with VS Code

To use this MCP server in VS Code, add the following configuration to your MCP settings file (or configure it via the Copilot MCP UI):

```json
{
  "mcpServers": {
    "mcp-db-sampler": {
      "command": "node",
      "args": ["D:/Project/demo_ai_workspace/demo_tools/mcp-db-sampler/build/index.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_PORT": "5432",
        "DB_NAME": "hoian_blog",
        "DB_USER": "postgres",
        "DB_PASSWORD": "yourpassword"
      }
    }
  }
}
```