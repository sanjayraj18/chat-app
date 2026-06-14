import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import config from "../config/config";

// 1. Create a connection pool using the 'pg' library
const connectionString = config.DATABASE_URL;
const pool = new Pool({ connectionString });

// 2. Wrap it in a Prisma adapter
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma with that adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
