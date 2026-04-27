// AI Controller - AI prediction endpoints
import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('AI Prediction')
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('predict')
  @ApiOperation({ summary: 'Make AI prediction' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async makePrediction(
    @CurrentUser() user: CurrentUserPayload,
    @Body() predictionRequest: { input: string; context?: Record<string, any> }
  ) {
    try {
      const result = await this.aiService.makePrediction(predictionRequest);
      
      return {
        success: true,
        data: result,
        message: 'Prediction completed successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Prediction failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  @Post('predict/batch')
  @ApiOperation({ summary: 'Make batch AI predictions' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async makeBatchPredictions(
    @CurrentUser() user: CurrentUserPayload,
    @Body() batchRequest: { inputs: string[]; context?: Record<string, any> }
  ) {
    try {
      const results = [];
      
      for (const input of batchRequest.inputs) {
        const result = await this.aiService.makePrediction({ input });
        results.push(result);
      }
      
      return {
        success: true,
        data: results,
        message: `Batch prediction completed for ${batchRequest.inputs.length} items`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Batch prediction failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('models')
  @ApiOperation({ summary: 'Get available AI models' })
  @ApiBearerAuth()
  async getModels() {
    try {
      const models = await this.aiService.getModelInfo();
      
      return {
        success: true,
        data: models,
        message: 'Models retrieved successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch models',
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('health')
  @ApiOperation({ summary: 'Check AI service health' })
  async healthCheck() {
    try {
      const health = await this.aiService.healthCheck();
      
      return {
        success: true,
        data: health,
        message: 'AI service is healthy',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'AI service health check failed',
        timestamp: new Date().toISOString()
      };
    }
  }
}
