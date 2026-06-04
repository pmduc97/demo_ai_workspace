#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "hoian_blog",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

const server = new Server(
  {
    name: "mcp-db-sampler",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_sample_data",
        description: "Get sample rows from a database table to understand data format.",
        inputSchema: {
          type: "object",
          properties: {
            table_name: { type: "string" },
            limit: { type: "number", description: "Max rows to return (default 3, max 10)" },
          },
          required: ["table_name"],
        },
      },
      {
        name: "get_valid_foreign_keys",
        description: "Get valid IDs from a table to use as foreign keys in test data.",
        inputSchema: {
          type: "object",
          properties: {
            table_name: { type: "string" },
            column_name: { type: "string", description: "Usually 'id'" },
            limit: { type: "number", description: "Max IDs to return (default 5)" },
          },
          required: ["table_name", "column_name"],
        },
      },
      {
        name: "execute_read_query",
        description: "Execute a custom SELECT query to find specific test data. ONLY SELECT is allowed.",
        inputSchema: {
          type: "object",
          properties: {
            sql_query: { type: "string", description: "The SELECT query to execute" },
          },
          required: ["sql_query"],
        },
      },
      {
        name: "get_live_schema_info",
        description: "Get live schema information (columns, types) for a table.",
        inputSchema: {
          type: "object",
          properties: {
            table_name: { type: "string" },
          },
          required: ["table_name"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get_sample_data") {
      const tableName = String(args?.table_name);
      const limit = Math.min(Number(args?.limit) || 3, 10);
      const result = await pool.query(`SELECT * FROM ${tableName} LIMIT $1`, [limit]);
      return { content: [{ type: "text", text: JSON.stringify(result.rows, null, 2) }] };
    }

    if (name === "get_valid_foreign_keys") {
      const tableName = String(args?.table_name);
      const columnName = String(args?.column_name);
      const limit = Math.min(Number(args?.limit) || 5, 20);
      const result = await pool.query(`SELECT ${columnName} FROM ${tableName} LIMIT $1`, [limit]);
      const ids = result.rows.map(r => r[columnName]);
      return { content: [{ type: "text", text: JSON.stringify(ids, null, 2) }] };
    }

    if (name === "execute_read_query") {
      const query = String(args?.sql_query);
      if (!query.trim().toUpperCase().startsWith("SELECT")) {
        throw new McpError(ErrorCode.InvalidRequest, "Only SELECT queries are allowed for safety.");
      }
      const result = await pool.query(query);
      return { content: [{ type: "text", text: JSON.stringify(result.rows, null, 2) }] };
    }

    if (name === "get_live_schema_info") {
      const tableName = String(args?.table_name);
      const query = `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `;
      const result = await pool.query(query, [tableName]);
      return { content: [{ type: "text", text: JSON.stringify(result.rows, null, 2) }] };
    }

    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP DB Sampler Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});