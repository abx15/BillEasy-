// Products Controller - Product management endpoints
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiBearerAuth()
  async findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.productsService.findAll(user.businessId);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock products' })
  @ApiBearerAuth()
  async getLowStock(@CurrentUser() user: CurrentUserPayload) {
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

  @Post()
  @ApiOperation({ summary: 'Create new product' })
  @ApiBearerAuth()
  async create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsService.create(user.businessId, createProductDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Product ID' })
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() updateProductDto: any
  ) {
    return this.productsService.update(user.businessId, id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Product ID' })
  async remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string
  ) {
    return this.productsService.remove(user.businessId, id);
  }
}
