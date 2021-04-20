import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Sse,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTokenDto } from './dto/create-token.dto';
import { ApiService } from './api.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UserDto } from './dto/user.dto';
import { Observable } from 'rxjs';
import { TokenDto } from './dto/token.dto';

@Controller('api')
@ApiTags('api')
@ApiBearerAuth()
export class ApiController {
  constructor(
    private readonly _apiService: ApiService,
  ) {
  }

  @Get('init')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: UserDto,
    description: 'token has been successfully created'
  })
  async createAlertToken(
    @Query() createTokenDto: CreateTokenDto
  ): Promise<UserDto> {
    return this._apiService.createToken(createTokenDto);
  }

  @Get('getAllTradingPairs')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'get all trading pairs'
  })
  async getAllTradingPairs(
    @Query() getAllTradingPairs: TokenDto
  ): Promise<any> {
    return this._apiService.getAllTradingPairs(getAllTradingPairs);
  }

  @Sse('alertPull')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: Object,
    description: 'alert pull'
  })
  alertPull(
    @Query() alertPullDto: TokenDto
  ): Observable<any>{
    return this._apiService.alertPull(alertPullDto);
  }

  @Get('getUserBalance')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: Object,
    description: 'get user balance'
  })
  async getUserBalance(
    @Query() getUserBalanceDto: TokenDto
  ): Promise<any> {
    return this._apiService.getUserBalance(getUserBalanceDto);
  }


  @Post('createAlert')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: Object,
    description: 'alert has been successfully created'
  })
  async createAlert(
    @Body() createAlertDto: CreateAlertDto
  ): Promise<{ alertToken: string }> {
    return await this._apiService.createAlert(createAlertDto);
  }


  @Delete('destroy')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async deleteToken(
    @Query() removeTokenDto: TokenDto
  ): Promise<void> {
    await this._apiService.deleteToken(removeTokenDto);
  }
}
