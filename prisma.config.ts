// Prisma Configuration for SEMOP ERP
// Version: 2.1.10

import { defineConfig } from '@prisma/cli';

export default defineConfig({
  datasources: {
    db: {
      url: 'postgresql://semop_user:semop123456@localhost:5432/semop_db',
    },
  },
});
