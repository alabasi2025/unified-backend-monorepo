import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { CreateBillingDTO } from './dto/create-billing.dto';
import { UpdateBillingDTO } from './dto/update-billing.dto';
import { BillingQueryDTO } from './dto/billing-query.dto';
import { BillingResponseDTO } from './dto/billing-response.dto';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @ApiOperation({ summary: 'Create billing record' })
  @ApiResponse({ status: 201, description: 'Billing created', type: BillingResponseDTO })
  async create(@Body() createDto: CreateBillingDTO) {
    return await this.billingService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all billing records' })
  @ApiResponse({ status: 200, description: 'List of billing records', type: [BillingResponseDTO] })
  async findAll(@Query() query: BillingQueryDTO) {
    return await this.billingService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get billing by ID' })
  @ApiResponse({ status: 200, description: 'Billing record', type: BillingResponseDTO })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.billingService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update billing' })
  @ApiResponse({ status: 200, description: 'Billing updated', type: BillingResponseDTO })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateBillingDTO) {
    return await this.billingService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete billing' })
  @ApiResponse({ status: 200, description: 'Billing deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.billingService.remove(id);
  }
}