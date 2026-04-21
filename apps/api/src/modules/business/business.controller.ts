// Business Controller - Business profile endpoints
import { 
  Controller, 
  Get, 
  Put, 
  Post, 
  Body, 
  UploadedFile, 
  UseInterceptors,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { BusinessService, UpdateBusinessDto } from './business.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Business')
@Controller('business')
@UseGuards(JwtAuthGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get business profile' })
  @ApiBearerAuth()
  async getProfile(@CurrentUser() user: CurrentUserPayload) {
    return this.businessService.getProfile(user.businessId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update business profile' })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  async updateProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Body() updateDto: UpdateBusinessDto
  ) {
    return this.businessService.updateProfile(user.businessId, updateDto);
  }

  @Post('logo')
  @ApiOperation({ summary: 'Upload business logo' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  async uploadLogo(
    @CurrentUser() user: CurrentUserPayload,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.businessService.uploadLogo(user.businessId, file);
  }
}
