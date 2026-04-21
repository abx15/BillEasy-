// Products Controller - Product management endpoints
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Query, 
  Body, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { 
  ProductsService, 
  CreateProductDto, 
  UpdateProductDto, 
  ProductQuery, 
  StockAdjustmentDto 
} from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination and filters' })
  @ApiBearerAuth()
  async findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: ProductQuery
  ) {
    return this.productsService.findAll(user.businessId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBearerAuth()
  async create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createDto: CreateProductDto
  ) {
    return this.productsService.create(user.businessId, createDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products for autocomplete' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'q', description: 'Search query' })
  async searchProducts(
    @CurrentUser() user: CurrentUserPayload,
    @Query('q') query: string
  ) {
    return this.productsService.searchProducts(user.businessId, query);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get products with low stock' })
  @ApiBearerAuth()
  async getLowStockProducts(@CurrentUser() user: CurrentUserPayload) {
    return this.productsService.getLowStockProducts(user.businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Product ID' })
  async findOne(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string
  ) {
    return this.productsService.findOne(user.businessId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Product ID' })
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() updateDto: UpdateProductDto
  ) {
    return this.productsService.update(user.businessId, id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product (soft delete)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Product ID' })
  async remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string
  ) {
    return this.productsService.remove(user.businessId, id);
  }

  @Put(':id/stock')
  @ApiOperation({ summary: 'Adjust product stock' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Product ID' })
  async adjustStock(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() adjustmentDto: StockAdjustmentDto
  ) {
    return this.productsService.adjustStock(id, adjustmentDto);
  }
}
