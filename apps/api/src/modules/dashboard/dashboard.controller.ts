// Dashboard Controller - Dashboard endpoints
import { 
  Controller, 
  Get, 
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard data' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getDashboard(@CurrentUser() user: CurrentUserPayload) {
    try {
      // Get business information
      const business = await this.prisma.business.findUnique({
        where: { id: user.businessId },
        include: {
          _count: {
            select: {
              users: true,
              products: true,
              customers: true,
              bills: true,
            }
          }
        }
      });

      // Get recent bills
      const recentBills = await this.prisma.bill.findMany({
        where: { businessId: user.businessId },
        include: {
          customer: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      });

      // Get low stock products
      const lowStockProducts = await this.prisma.product.findMany({
        where: { 
          businessId: user.businessId,
          stockQuantity: { lte: 20 } // Use a default threshold
        },
        orderBy: { stockQuantity: 'asc' },
        take: 10
      });

      // Get monthly revenue
      const currentMonth = new Date();
      currentMonth.setDate(1);
      const monthlyRevenue = await this.prisma.bill.aggregate({
        where: {
          businessId: user.businessId,
          createdAt: { gte: currentMonth }
        },
        _sum: {
          totalAmount: true
        }
      });

      return {
        success: true,
        data: {
          business: {
            ...business,
            monthlyRevenue: monthlyRevenue._sum.totalAmount || 0
          },
          recentBills,
          lowStockProducts,
          stats: {
            totalUsers: business._count.users,
            totalProducts: business._count.products,
            totalCustomers: business._count.customers,
            totalBills: business._count.bills,
            lowStockCount: lowStockProducts.length
          }
        },
        message: 'Dashboard data retrieved successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch dashboard data',
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getDashboardStats(@CurrentUser() user: CurrentUserPayload) {
    try {
      const stats = await this.prisma.$transaction([
        // Total revenue
        this.prisma.bill.aggregate({
          where: { businessId: user.businessId },
          _sum: { totalAmount: true }
        }),
        // This month's revenue
        this.prisma.bill.aggregate({
          where: {
            businessId: user.businessId,
            createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
          },
          _sum: { totalAmount: true }
        }),
        // Total bills
        this.prisma.bill.count({
          where: { businessId: user.businessId }
        }),
        // Total customers
        this.prisma.customer.count({
          where: { businessId: user.businessId }
        }),
        // Total products
        this.prisma.product.count({
          where: { businessId: user.businessId }
        })
      ]);

      return {
        success: true,
        data: {
          totalRevenue: stats[0]._sum.totalAmount || 0,
          monthlyRevenue: stats[1]._sum.totalAmount || 0,
          totalBills: stats[2],
          totalCustomers: stats[3],
          totalProducts: stats[4]
        },
        message: 'Dashboard stats retrieved successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch dashboard stats',
        timestamp: new Date().toISOString()
      };
    }
  }
}
