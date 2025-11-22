import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Create PostgreSQL connection pool with explicit configuration
    const connectionString = process.env.DATABASE_URL;
    
    const pool = new Pool({ 
      connectionString,
      // Ensure password is treated as string
      connectionTimeoutMillis: 5000,
    });
    
    // Create Prisma adapter for PostgreSQL
    const adapter = new PrismaPg(pool);
    
    // Initialize PrismaClient with adapter
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
