-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BILLING', 'SHIPPING', 'BOTH');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('PRODUCT', 'SERVICE', 'MATERIAL');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('PURCHASE_RECEIPT', 'SALES_ISSUE', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'OPENING_BALANCE', 'RETURN_FROM_CUSTOMER', 'RETURN_TO_SUPPLIER');

-- CreateEnum
CREATE TYPE "StockCountStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PurchaseInvoiceStatus" AS ENUM ('DRAFT', 'POSTED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PurchaseReturnStatus" AS ENUM ('DRAFT', 'POSTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SalesOrderStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'PARTIALLY_INVOICED', 'INVOICED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SalesInvoiceStatus" AS ENUM ('DRAFT', 'POSTED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SalesReturnStatus" AS ENUM ('DRAFT', 'POSTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "supplier_categories" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "supplier_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "taxNumber" TEXT,
    "commercialRegister" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "paymentTerms" INTEGER NOT NULL DEFAULT 30,
    "creditLimit" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "currentBalance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT,
    "holdingId" TEXT,
    "unitId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_addresses" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "addressType" "AddressType" NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "street" TEXT,
    "buildingNumber" TEXT,
    "postalCode" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_contacts" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_categories" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "description" TEXT,
    "discountPercentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "customer_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "taxNumber" TEXT,
    "commercialRegister" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "paymentTerms" INTEGER NOT NULL DEFAULT 30,
    "creditLimit" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "currentBalance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT,
    "holdingId" TEXT,
    "unitId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "addressType" "AddressType" NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "street" TEXT,
    "buildingNumber" TEXT,
    "postalCode" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_contacts" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_categories" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "item_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "barcode" TEXT,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "description" TEXT,
    "itemType" "ItemType" NOT NULL,
    "unit" TEXT NOT NULL,
    "costPrice" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "sellingPrice" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "minSellingPrice" DECIMAL(15,2),
    "reorderLevel" DECIMAL(10,2),
    "maxStockLevel" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSellable" BOOLEAN NOT NULL DEFAULT true,
    "isPurchasable" BOOLEAN NOT NULL DEFAULT true,
    "isStockable" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT,
    "salesAccountId" TEXT,
    "purchaseAccountId" TEXT,
    "inventoryAccountId" TEXT,
    "holdingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "holdingId" TEXT,
    "unitId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_levels" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "reservedQuantity" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "availableQuantity" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL,
    "movementNumber" TEXT NOT NULL,
    "movementDate" TIMESTAMP(3) NOT NULL,
    "movementType" "StockMovementType" NOT NULL,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unitCost" DECIMAL(15,2),
    "totalCost" DECIMAL(15,2),
    "reference" TEXT,
    "notes" TEXT,
    "purchaseInvoiceLineId" TEXT,
    "salesInvoiceLineId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_counts" (
    "id" TEXT NOT NULL,
    "countNumber" TEXT NOT NULL,
    "countDate" TIMESTAMP(3) NOT NULL,
    "status" "StockCountStatus" NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "completedAt" TIMESTAMP(3),
    "completedBy" TEXT,

    CONSTRAINT "stock_counts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_count_lines" (
    "id" TEXT NOT NULL,
    "stockCountId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "systemQuantity" DECIMAL(10,2) NOT NULL,
    "countedQuantity" DECIMAL(10,2) NOT NULL,
    "difference" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_count_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "expectedDeliveryDate" TIMESTAMP(3),
    "status" "PurchaseOrderStatus" NOT NULL,
    "supplierId" TEXT NOT NULL,
    "subtotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "holdingId" TEXT,
    "unitId" TEXT,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_lines" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 15,
    "discountRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(15,2) NOT NULL,
    "taxAmount" DECIMAL(15,2) NOT NULL,
    "discountAmount" DECIMAL(15,2) NOT NULL,
    "netAmount" DECIMAL(15,2) NOT NULL,
    "receivedQuantity" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_order_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "supplierInvoiceNumber" TEXT,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "PurchaseInvoiceStatus" NOT NULL,
    "supplierId" TEXT NOT NULL,
    "purchaseOrderId" TEXT,
    "subtotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "paidAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "remainingAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "holdingId" TEXT,
    "unitId" TEXT,
    "projectId" TEXT,
    "journalEntryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "postedAt" TIMESTAMP(3),
    "postedBy" TEXT,

    CONSTRAINT "purchase_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_invoice_lines" (
    "id" TEXT NOT NULL,
    "purchaseInvoiceId" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 15,
    "discountRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(15,2) NOT NULL,
    "taxAmount" DECIMAL(15,2) NOT NULL,
    "discountAmount" DECIMAL(15,2) NOT NULL,
    "netAmount" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_invoice_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_returns" (
    "id" TEXT NOT NULL,
    "returnNumber" TEXT NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL,
    "status" "PurchaseReturnStatus" NOT NULL,
    "supplierId" TEXT NOT NULL,
    "purchaseInvoiceId" TEXT NOT NULL,
    "totalAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "reason" TEXT,
    "notes" TEXT,
    "holdingId" TEXT,
    "unitId" TEXT,
    "journalEntryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "purchase_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_return_lines" (
    "id" TEXT NOT NULL,
    "purchaseReturnId" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 15,
    "lineTotal" DECIMAL(15,2) NOT NULL,
    "taxAmount" DECIMAL(15,2) NOT NULL,
    "netAmount" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_return_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "expectedDeliveryDate" TIMESTAMP(3),
    "status" "SalesOrderStatus" NOT NULL,
    "customerId" TEXT NOT NULL,
    "subtotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "holdingId" TEXT,
    "unitId" TEXT,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "sales_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_order_lines" (
    "id" TEXT NOT NULL,
    "salesOrderId" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 15,
    "discountRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(15,2) NOT NULL,
    "taxAmount" DECIMAL(15,2) NOT NULL,
    "discountAmount" DECIMAL(15,2) NOT NULL,
    "netAmount" DECIMAL(15,2) NOT NULL,
    "invoicedQuantity" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_order_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "SalesInvoiceStatus" NOT NULL,
    "customerId" TEXT NOT NULL,
    "salesOrderId" TEXT,
    "subtotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "paidAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "remainingAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "holdingId" TEXT,
    "unitId" TEXT,
    "projectId" TEXT,
    "journalEntryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "postedAt" TIMESTAMP(3),
    "postedBy" TEXT,

    CONSTRAINT "sales_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_invoice_lines" (
    "id" TEXT NOT NULL,
    "salesInvoiceId" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 15,
    "discountRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(15,2) NOT NULL,
    "taxAmount" DECIMAL(15,2) NOT NULL,
    "discountAmount" DECIMAL(15,2) NOT NULL,
    "netAmount" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_invoice_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_returns" (
    "id" TEXT NOT NULL,
    "returnNumber" TEXT NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL,
    "status" "SalesReturnStatus" NOT NULL,
    "customerId" TEXT NOT NULL,
    "salesInvoiceId" TEXT NOT NULL,
    "totalAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "reason" TEXT,
    "notes" TEXT,
    "holdingId" TEXT,
    "unitId" TEXT,
    "journalEntryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "sales_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_return_lines" (
    "id" TEXT NOT NULL,
    "salesReturnId" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 15,
    "lineTotal" DECIMAL(15,2) NOT NULL,
    "taxAmount" DECIMAL(15,2) NOT NULL,
    "netAmount" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_return_lines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "supplier_categories_code_key" ON "supplier_categories"("code");

-- CreateIndex
CREATE INDEX "supplier_categories_code_idx" ON "supplier_categories"("code");

-- CreateIndex
CREATE INDEX "supplier_categories_isActive_idx" ON "supplier_categories"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_code_key" ON "suppliers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_taxNumber_key" ON "suppliers"("taxNumber");

-- CreateIndex
CREATE INDEX "suppliers_code_idx" ON "suppliers"("code");

-- CreateIndex
CREATE INDEX "suppliers_taxNumber_idx" ON "suppliers"("taxNumber");

-- CreateIndex
CREATE INDEX "suppliers_email_idx" ON "suppliers"("email");

-- CreateIndex
CREATE INDEX "suppliers_categoryId_idx" ON "suppliers"("categoryId");

-- CreateIndex
CREATE INDEX "suppliers_holdingId_idx" ON "suppliers"("holdingId");

-- CreateIndex
CREATE INDEX "suppliers_unitId_idx" ON "suppliers"("unitId");

-- CreateIndex
CREATE INDEX "suppliers_isActive_idx" ON "suppliers"("isActive");

-- CreateIndex
CREATE INDEX "supplier_addresses_supplierId_idx" ON "supplier_addresses"("supplierId");

-- CreateIndex
CREATE INDEX "supplier_addresses_addressType_idx" ON "supplier_addresses"("addressType");

-- CreateIndex
CREATE INDEX "supplier_addresses_isPrimary_idx" ON "supplier_addresses"("isPrimary");

-- CreateIndex
CREATE INDEX "supplier_contacts_supplierId_idx" ON "supplier_contacts"("supplierId");

-- CreateIndex
CREATE INDEX "supplier_contacts_isPrimary_idx" ON "supplier_contacts"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "customer_categories_code_key" ON "customer_categories"("code");

-- CreateIndex
CREATE INDEX "customer_categories_code_idx" ON "customer_categories"("code");

-- CreateIndex
CREATE INDEX "customer_categories_isActive_idx" ON "customer_categories"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "customers_code_key" ON "customers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "customers_taxNumber_key" ON "customers"("taxNumber");

-- CreateIndex
CREATE INDEX "customers_code_idx" ON "customers"("code");

-- CreateIndex
CREATE INDEX "customers_taxNumber_idx" ON "customers"("taxNumber");

-- CreateIndex
CREATE INDEX "customers_email_idx" ON "customers"("email");

-- CreateIndex
CREATE INDEX "customers_categoryId_idx" ON "customers"("categoryId");

-- CreateIndex
CREATE INDEX "customers_holdingId_idx" ON "customers"("holdingId");

-- CreateIndex
CREATE INDEX "customers_unitId_idx" ON "customers"("unitId");

-- CreateIndex
CREATE INDEX "customers_isActive_idx" ON "customers"("isActive");

-- CreateIndex
CREATE INDEX "customer_addresses_customerId_idx" ON "customer_addresses"("customerId");

-- CreateIndex
CREATE INDEX "customer_addresses_addressType_idx" ON "customer_addresses"("addressType");

-- CreateIndex
CREATE INDEX "customer_addresses_isPrimary_idx" ON "customer_addresses"("isPrimary");

-- CreateIndex
CREATE INDEX "customer_contacts_customerId_idx" ON "customer_contacts"("customerId");

-- CreateIndex
CREATE INDEX "customer_contacts_isPrimary_idx" ON "customer_contacts"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "item_categories_code_key" ON "item_categories"("code");

-- CreateIndex
CREATE INDEX "item_categories_code_idx" ON "item_categories"("code");

-- CreateIndex
CREATE INDEX "item_categories_parentId_idx" ON "item_categories"("parentId");

-- CreateIndex
CREATE INDEX "item_categories_isActive_idx" ON "item_categories"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "items_code_key" ON "items"("code");

-- CreateIndex
CREATE UNIQUE INDEX "items_barcode_key" ON "items"("barcode");

-- CreateIndex
CREATE INDEX "items_code_idx" ON "items"("code");

-- CreateIndex
CREATE INDEX "items_barcode_idx" ON "items"("barcode");

-- CreateIndex
CREATE INDEX "items_itemType_idx" ON "items"("itemType");

-- CreateIndex
CREATE INDEX "items_categoryId_idx" ON "items"("categoryId");

-- CreateIndex
CREATE INDEX "items_salesAccountId_idx" ON "items"("salesAccountId");

-- CreateIndex
CREATE INDEX "items_purchaseAccountId_idx" ON "items"("purchaseAccountId");

-- CreateIndex
CREATE INDEX "items_inventoryAccountId_idx" ON "items"("inventoryAccountId");

-- CreateIndex
CREATE INDEX "items_holdingId_idx" ON "items"("holdingId");

-- CreateIndex
CREATE INDEX "items_isActive_idx" ON "items"("isActive");

-- CreateIndex
CREATE INDEX "items_isSellable_idx" ON "items"("isSellable");

-- CreateIndex
CREATE INDEX "items_isPurchasable_idx" ON "items"("isPurchasable");

-- CreateIndex
CREATE INDEX "items_isStockable_idx" ON "items"("isStockable");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_code_key" ON "warehouses"("code");

-- CreateIndex
CREATE INDEX "warehouses_code_idx" ON "warehouses"("code");

-- CreateIndex
CREATE INDEX "warehouses_holdingId_idx" ON "warehouses"("holdingId");

-- CreateIndex
CREATE INDEX "warehouses_unitId_idx" ON "warehouses"("unitId");

-- CreateIndex
CREATE INDEX "warehouses_isActive_idx" ON "warehouses"("isActive");

-- CreateIndex
CREATE INDEX "stock_levels_itemId_idx" ON "stock_levels"("itemId");

-- CreateIndex
CREATE INDEX "stock_levels_warehouseId_idx" ON "stock_levels"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_levels_itemId_warehouseId_key" ON "stock_levels"("itemId", "warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_movements_movementNumber_key" ON "stock_movements"("movementNumber");

-- CreateIndex
CREATE INDEX "stock_movements_movementNumber_idx" ON "stock_movements"("movementNumber");

-- CreateIndex
CREATE INDEX "stock_movements_movementDate_idx" ON "stock_movements"("movementDate");

-- CreateIndex
CREATE INDEX "stock_movements_movementType_idx" ON "stock_movements"("movementType");

-- CreateIndex
CREATE INDEX "stock_movements_itemId_idx" ON "stock_movements"("itemId");

-- CreateIndex
CREATE INDEX "stock_movements_warehouseId_idx" ON "stock_movements"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_counts_countNumber_key" ON "stock_counts"("countNumber");

-- CreateIndex
CREATE INDEX "stock_counts_countNumber_idx" ON "stock_counts"("countNumber");

-- CreateIndex
CREATE INDEX "stock_counts_countDate_idx" ON "stock_counts"("countDate");

-- CreateIndex
CREATE INDEX "stock_counts_status_idx" ON "stock_counts"("status");

-- CreateIndex
CREATE INDEX "stock_counts_warehouseId_idx" ON "stock_counts"("warehouseId");

-- CreateIndex
CREATE INDEX "stock_count_lines_stockCountId_idx" ON "stock_count_lines"("stockCountId");

-- CreateIndex
CREATE INDEX "stock_count_lines_itemId_idx" ON "stock_count_lines"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_orderNumber_key" ON "purchase_orders"("orderNumber");

-- CreateIndex
CREATE INDEX "purchase_orders_orderNumber_idx" ON "purchase_orders"("orderNumber");

-- CreateIndex
CREATE INDEX "purchase_orders_orderDate_idx" ON "purchase_orders"("orderDate");

-- CreateIndex
CREATE INDEX "purchase_orders_status_idx" ON "purchase_orders"("status");

-- CreateIndex
CREATE INDEX "purchase_orders_supplierId_idx" ON "purchase_orders"("supplierId");

-- CreateIndex
CREATE INDEX "purchase_orders_holdingId_idx" ON "purchase_orders"("holdingId");

-- CreateIndex
CREATE INDEX "purchase_orders_unitId_idx" ON "purchase_orders"("unitId");

-- CreateIndex
CREATE INDEX "purchase_orders_projectId_idx" ON "purchase_orders"("projectId");

-- CreateIndex
CREATE INDEX "purchase_order_lines_purchaseOrderId_idx" ON "purchase_order_lines"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "purchase_order_lines_itemId_idx" ON "purchase_order_lines"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_order_lines_purchaseOrderId_lineNumber_key" ON "purchase_order_lines"("purchaseOrderId", "lineNumber");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_invoices_invoiceNumber_key" ON "purchase_invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "purchase_invoices_invoiceNumber_idx" ON "purchase_invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "purchase_invoices_invoiceDate_idx" ON "purchase_invoices"("invoiceDate");

-- CreateIndex
CREATE INDEX "purchase_invoices_status_idx" ON "purchase_invoices"("status");

-- CreateIndex
CREATE INDEX "purchase_invoices_supplierId_idx" ON "purchase_invoices"("supplierId");

-- CreateIndex
CREATE INDEX "purchase_invoices_purchaseOrderId_idx" ON "purchase_invoices"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "purchase_invoices_journalEntryId_idx" ON "purchase_invoices"("journalEntryId");

-- CreateIndex
CREATE INDEX "purchase_invoices_holdingId_idx" ON "purchase_invoices"("holdingId");

-- CreateIndex
CREATE INDEX "purchase_invoices_unitId_idx" ON "purchase_invoices"("unitId");

-- CreateIndex
CREATE INDEX "purchase_invoices_projectId_idx" ON "purchase_invoices"("projectId");

-- CreateIndex
CREATE INDEX "purchase_invoice_lines_purchaseInvoiceId_idx" ON "purchase_invoice_lines"("purchaseInvoiceId");

-- CreateIndex
CREATE INDEX "purchase_invoice_lines_itemId_idx" ON "purchase_invoice_lines"("itemId");

-- CreateIndex
CREATE INDEX "purchase_invoice_lines_warehouseId_idx" ON "purchase_invoice_lines"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_invoice_lines_purchaseInvoiceId_lineNumber_key" ON "purchase_invoice_lines"("purchaseInvoiceId", "lineNumber");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_returns_returnNumber_key" ON "purchase_returns"("returnNumber");

-- CreateIndex
CREATE INDEX "purchase_returns_returnNumber_idx" ON "purchase_returns"("returnNumber");

-- CreateIndex
CREATE INDEX "purchase_returns_returnDate_idx" ON "purchase_returns"("returnDate");

-- CreateIndex
CREATE INDEX "purchase_returns_status_idx" ON "purchase_returns"("status");

-- CreateIndex
CREATE INDEX "purchase_returns_supplierId_idx" ON "purchase_returns"("supplierId");

-- CreateIndex
CREATE INDEX "purchase_returns_purchaseInvoiceId_idx" ON "purchase_returns"("purchaseInvoiceId");

-- CreateIndex
CREATE INDEX "purchase_returns_journalEntryId_idx" ON "purchase_returns"("journalEntryId");

-- CreateIndex
CREATE INDEX "purchase_returns_holdingId_idx" ON "purchase_returns"("holdingId");

-- CreateIndex
CREATE INDEX "purchase_returns_unitId_idx" ON "purchase_returns"("unitId");

-- CreateIndex
CREATE INDEX "purchase_return_lines_purchaseReturnId_idx" ON "purchase_return_lines"("purchaseReturnId");

-- CreateIndex
CREATE INDEX "purchase_return_lines_itemId_idx" ON "purchase_return_lines"("itemId");

-- CreateIndex
CREATE INDEX "purchase_return_lines_warehouseId_idx" ON "purchase_return_lines"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_return_lines_purchaseReturnId_lineNumber_key" ON "purchase_return_lines"("purchaseReturnId", "lineNumber");

-- CreateIndex
CREATE UNIQUE INDEX "sales_orders_orderNumber_key" ON "sales_orders"("orderNumber");

-- CreateIndex
CREATE INDEX "sales_orders_orderNumber_idx" ON "sales_orders"("orderNumber");

-- CreateIndex
CREATE INDEX "sales_orders_orderDate_idx" ON "sales_orders"("orderDate");

-- CreateIndex
CREATE INDEX "sales_orders_status_idx" ON "sales_orders"("status");

-- CreateIndex
CREATE INDEX "sales_orders_customerId_idx" ON "sales_orders"("customerId");

-- CreateIndex
CREATE INDEX "sales_orders_holdingId_idx" ON "sales_orders"("holdingId");

-- CreateIndex
CREATE INDEX "sales_orders_unitId_idx" ON "sales_orders"("unitId");

-- CreateIndex
CREATE INDEX "sales_orders_projectId_idx" ON "sales_orders"("projectId");

-- CreateIndex
CREATE INDEX "sales_order_lines_salesOrderId_idx" ON "sales_order_lines"("salesOrderId");

-- CreateIndex
CREATE INDEX "sales_order_lines_itemId_idx" ON "sales_order_lines"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_order_lines_salesOrderId_lineNumber_key" ON "sales_order_lines"("salesOrderId", "lineNumber");

-- CreateIndex
CREATE UNIQUE INDEX "sales_invoices_invoiceNumber_key" ON "sales_invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "sales_invoices_invoiceNumber_idx" ON "sales_invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "sales_invoices_invoiceDate_idx" ON "sales_invoices"("invoiceDate");

-- CreateIndex
CREATE INDEX "sales_invoices_status_idx" ON "sales_invoices"("status");

-- CreateIndex
CREATE INDEX "sales_invoices_customerId_idx" ON "sales_invoices"("customerId");

-- CreateIndex
CREATE INDEX "sales_invoices_salesOrderId_idx" ON "sales_invoices"("salesOrderId");

-- CreateIndex
CREATE INDEX "sales_invoices_journalEntryId_idx" ON "sales_invoices"("journalEntryId");

-- CreateIndex
CREATE INDEX "sales_invoices_holdingId_idx" ON "sales_invoices"("holdingId");

-- CreateIndex
CREATE INDEX "sales_invoices_unitId_idx" ON "sales_invoices"("unitId");

-- CreateIndex
CREATE INDEX "sales_invoices_projectId_idx" ON "sales_invoices"("projectId");

-- CreateIndex
CREATE INDEX "sales_invoice_lines_salesInvoiceId_idx" ON "sales_invoice_lines"("salesInvoiceId");

-- CreateIndex
CREATE INDEX "sales_invoice_lines_itemId_idx" ON "sales_invoice_lines"("itemId");

-- CreateIndex
CREATE INDEX "sales_invoice_lines_warehouseId_idx" ON "sales_invoice_lines"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_invoice_lines_salesInvoiceId_lineNumber_key" ON "sales_invoice_lines"("salesInvoiceId", "lineNumber");

-- CreateIndex
CREATE UNIQUE INDEX "sales_returns_returnNumber_key" ON "sales_returns"("returnNumber");

-- CreateIndex
CREATE INDEX "sales_returns_returnNumber_idx" ON "sales_returns"("returnNumber");

-- CreateIndex
CREATE INDEX "sales_returns_returnDate_idx" ON "sales_returns"("returnDate");

-- CreateIndex
CREATE INDEX "sales_returns_status_idx" ON "sales_returns"("status");

-- CreateIndex
CREATE INDEX "sales_returns_customerId_idx" ON "sales_returns"("customerId");

-- CreateIndex
CREATE INDEX "sales_returns_salesInvoiceId_idx" ON "sales_returns"("salesInvoiceId");

-- CreateIndex
CREATE INDEX "sales_returns_journalEntryId_idx" ON "sales_returns"("journalEntryId");

-- CreateIndex
CREATE INDEX "sales_returns_holdingId_idx" ON "sales_returns"("holdingId");

-- CreateIndex
CREATE INDEX "sales_returns_unitId_idx" ON "sales_returns"("unitId");

-- CreateIndex
CREATE INDEX "sales_return_lines_salesReturnId_idx" ON "sales_return_lines"("salesReturnId");

-- CreateIndex
CREATE INDEX "sales_return_lines_itemId_idx" ON "sales_return_lines"("itemId");

-- CreateIndex
CREATE INDEX "sales_return_lines_warehouseId_idx" ON "sales_return_lines"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_return_lines_salesReturnId_lineNumber_key" ON "sales_return_lines"("salesReturnId", "lineNumber");

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "supplier_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_addresses" ADD CONSTRAINT "supplier_addresses_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_contacts" ADD CONSTRAINT "supplier_contacts_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "customer_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_contacts" ADD CONSTRAINT "customer_contacts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_categories" ADD CONSTRAINT "item_categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "item_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "item_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_salesAccountId_fkey" FOREIGN KEY ("salesAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_purchaseAccountId_fkey" FOREIGN KEY ("purchaseAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_inventoryAccountId_fkey" FOREIGN KEY ("inventoryAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_levels" ADD CONSTRAINT "stock_levels_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_levels" ADD CONSTRAINT "stock_levels_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_counts" ADD CONSTRAINT "stock_counts_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_count_lines" ADD CONSTRAINT "stock_count_lines_stockCountId_fkey" FOREIGN KEY ("stockCountId") REFERENCES "stock_counts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_count_lines" ADD CONSTRAINT "stock_count_lines_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_lines" ADD CONSTRAINT "purchase_order_lines_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_lines" ADD CONSTRAINT "purchase_order_lines_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_invoices" ADD CONSTRAINT "purchase_invoices_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_invoices" ADD CONSTRAINT "purchase_invoices_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_invoices" ADD CONSTRAINT "purchase_invoices_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_invoice_lines" ADD CONSTRAINT "purchase_invoice_lines_purchaseInvoiceId_fkey" FOREIGN KEY ("purchaseInvoiceId") REFERENCES "purchase_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_invoice_lines" ADD CONSTRAINT "purchase_invoice_lines_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_invoice_lines" ADD CONSTRAINT "purchase_invoice_lines_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_purchaseInvoiceId_fkey" FOREIGN KEY ("purchaseInvoiceId") REFERENCES "purchase_invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_return_lines" ADD CONSTRAINT "purchase_return_lines_purchaseReturnId_fkey" FOREIGN KEY ("purchaseReturnId") REFERENCES "purchase_returns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order_lines" ADD CONSTRAINT "sales_order_lines_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "sales_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order_lines" ADD CONSTRAINT "sales_order_lines_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "sales_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_invoice_lines" ADD CONSTRAINT "sales_invoice_lines_salesInvoiceId_fkey" FOREIGN KEY ("salesInvoiceId") REFERENCES "sales_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_invoice_lines" ADD CONSTRAINT "sales_invoice_lines_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_invoice_lines" ADD CONSTRAINT "sales_invoice_lines_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_returns" ADD CONSTRAINT "sales_returns_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_returns" ADD CONSTRAINT "sales_returns_salesInvoiceId_fkey" FOREIGN KEY ("salesInvoiceId") REFERENCES "sales_invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_returns" ADD CONSTRAINT "sales_returns_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_return_lines" ADD CONSTRAINT "sales_return_lines_salesReturnId_fkey" FOREIGN KEY ("salesReturnId") REFERENCES "sales_returns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
