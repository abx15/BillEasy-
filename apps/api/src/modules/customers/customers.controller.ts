// Customers Controller - Customer management endpoints
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CustomersService, CreateCustomerDto, UpdateCustomerDto, CustomerQuery } from './customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Customers')
@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers with pagination and search' })
  @ApiBearerAuth()
  async findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: CustomerQuery
  ) {
    return this.customersService.findAll(user.businessId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiBearerAuth()
  async create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createDto: CreateCustomerDto
  ) {
    return this.customersService.create(user.businessId, createDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Customer ID' })
  async findOne(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string
  ) {
    return this.customersService.findOne(user.businessId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Customer ID' })
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() updateDto: UpdateCustomerDto
  ) {
    return this.customersService.update(user.businessId, id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Customer ID' })
  async remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string
  ) {
    return this.customersService.remove(user.businessId, id);
  }

  @Get(':id/bills')
  @ApiOperation({ summary: 'Get bills for a specific customer' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Customer ID' })
  async getCustomerBills(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Query() query: CustomerQuery
  ) {
    return this.customersService.getCustomerBills(user.businessId, id, query);
  }
}
