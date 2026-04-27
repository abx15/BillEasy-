// AI Service - Integration with ML API for predictions
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { setTimeout } from 'timers/promises';

interface PredictionRequest {
  input: string;
  context?: Record<string, any>;
}

export interface PredictionResponse {
  prediction: string;
  confidence: number;
  input: string;
  model_type: string;
  timestamp: string;
  processing_time_ms?: number;
}

interface ErrorResponse {
  error: string;
  status: string;
}

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private readonly mlApiUrl: string;
  private readonly timeout: number;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.mlApiUrl = this.configService.get<string>('ML_API_URL') || 'http://localhost:8000';
    this.timeout = parseInt(this.configService.get<string>('ML_API_TIMEOUT', '10000'));
  }

  onModuleInit() {
    this.logger.log('AI Service initialized');
    this.logger.log(`ML API URL: ${this.mlApiUrl}`);
    this.logger.log(`ML API Timeout: ${this.timeout}ms`);
  }

  async makePrediction(request: PredictionRequest): Promise<PredictionResponse> {
    const startTime = Date.now();
    
    try {
      this.logger.log(`Making prediction request: ${JSON.stringify(request)}`);
      
      const config: AxiosRequestConfig = {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'BillEasy-Backend/1.0.0',
        },
      };

      const response: AxiosResponse<PredictionResponse> = await axios.post(
        `${this.mlApiUrl}/predict`,
        request,
        config
      );

      const processingTime = Date.now() - startTime;
      
      this.logger.log(`Prediction successful: ${response.data.prediction} (${response.data.confidence}% confidence)`);
      this.logger.log(`Processing time: ${processingTime}ms`);
      
      return response.data;
      
    } catch (error) {
      this.logger.error(`Prediction failed: ${error.message}`, error.stack);
      
      // Handle different types of errors
      if (error.code === 'ECONNREFUSED') {
        throw new Error('ML API service is not available. Please ensure the ML API is running on port 8000.');
      }
      
      if (error.code === 'ETIMEDOUT') {
        throw new Error('ML API request timed out. Please try again later.');
      }
      
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait before trying again.');
      }
      
      if (error.response?.status >= 500) {
        throw new Error('ML API internal error. Please try again later.');
      }
      
      // Generic error handling
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
      throw new Error(`Prediction failed: ${errorMessage}`);
    }
  }

  async getModelInfo(): Promise<any> {
    try {
      this.logger.log('Fetching available models info');
      
      const response = await axios.get(`${this.mlApiUrl}/predict/models`);
      
      this.logger.log('Available models retrieved successfully');
      return response.data;
      
    } catch (error) {
      this.logger.error('Failed to fetch model info', error.stack);
      throw new Error('Failed to fetch model information from ML API');
    }
  }

  async healthCheck(): Promise<{ status: string; service: string }> {
    try {
      this.logger.log('Performing ML API health check');
      
      const response = await axios.get(`${this.mlApiUrl}/health`);
      
      this.logger.log('ML API health check successful');
      return {
        status: response.data.status || 'unknown',
        service: 'ml-api'
      };
      
    } catch (error) {
      this.logger.error('ML API health check failed', error.stack);
      return {
        status: 'unhealthy',
        service: 'ml-api'
      };
    }
  }

  // Utility method for retry logic
  async makePredictionWithRetry(request: PredictionRequest, maxRetries: number = 3): Promise<PredictionResponse> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.makePrediction(request);
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          this.logger.warn(`Prediction attempt ${attempt} failed, retrying in ${attempt * 1000}ms...`);
          await setTimeout(attempt * 1000); // Exponential backoff
        }
      }
    }
    
    this.logger.error(`All ${maxRetries} prediction attempts failed`);
    throw lastError;
  }
}
