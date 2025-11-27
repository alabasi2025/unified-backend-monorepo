import { PartialType } from '@nestjs/swagger';
import { CreateBillingDTO } from './create-billing.dto';

/**
 * DTO for updating billing records
 * All fields are optional for partial updates
 */
export class UpdateBillingDTO extends PartialType(CreateBillingDTO) {}
