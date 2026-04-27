// Auth Controller - Authentication endpoints
import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, RegisterDto, LoginDto, AuthTokens } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { RegisterDto as RegisterValidationDto } from './dto/register.dto';
import { LoginDto as LoginValidationDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new business and owner' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterValidationDto): Promise<AuthTokens> {
    return this.authService.register(registerDto as RegisterDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and return tokens with user info' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginValidationDto) {
    const result = await this.authService.login(loginDto as LoginDto);
    
    return {
      success: true,
      data: {
        ...result,
        redirectUrl: '/dashboard'
      },
      message: 'Login successful',
      timestamp: new Date().toISOString()
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req: any): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(req.user.refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: CurrentUserPayload): Promise<void> {
    await this.authService.logout(user.sub);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMe(@CurrentUser() user: CurrentUserPayload) {
    return this.authService.getMe(user.sub);
  }
}
