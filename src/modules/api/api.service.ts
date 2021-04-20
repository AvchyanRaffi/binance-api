import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateTokenDto } from './dto/create-token.dto';
import * as ccxt from 'ccxt';
import { ConfigService } from '../../shared/services/config.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';
import { IAlerts } from './interfaces/alerts.interface';
import { from, Observable, timer } from 'rxjs';
import { mergeMap, take, takeWhile } from 'rxjs/operators';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class ApiService {
  constructor(
    public readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @InjectModel('Alerts') private readonly alertsModel: Model<IAlerts>,
  ) {}

  async createToken(
    createTokenDto: CreateTokenDto,
  ): Promise<UserDto> {
    try {
      const binanceClient = await this._createBinanceClient(createTokenDto.key, createTokenDto.secret)
      await binanceClient.account();

      const token = await this._createToken(createTokenDto.key, createTokenDto.secret);
      const user = new this.userModel({ token, enabled: true });
      await user.save();
      return new UserDto(user);
    } catch (e) {
      console.error(e)
    }
  }

  async getAllTradingPairs(
    getAllTradingPairs: TokenDto
  ): Promise<any> {
    try {
      const user = await this._findUser({ token: getAllTradingPairs.token, enabled: true })
      const { key, secret } = await this._verifyUser(user.token);
      const binanceClient = this._createBinanceClient(key, secret);
      return await binanceClient.fetchTickers();
    } catch (e) {
      console.error(e)
    }
  }

  alertPull(
    alertPullDto: TokenDto
  ): Observable<any> {
    return from(this._getClientFromAlertToken(alertPullDto.token))
      .pipe(mergeMap( ({ binanceClient, alert }) => {
        return timer(1000, 1000).pipe(mergeMap(async() => {
          const data = await binanceClient.fetchTicker(alert.pair);
          return { data: data, value: data.bid >= alert.min && data.bid <= alert.max };
        }), takeWhile(({ value }) => !value, true))
      }))
      .pipe(take(1));
  }

  async getUserBalance(
    getUserBalanceDto: TokenDto
  ): Promise<any> {
    try {
      const user = await this._findUser({ token: getUserBalanceDto.token, enabled: true })
      const { key, secret } = await this._verifyUser(user.token);
      const binanceClient = this._createBinanceClient(key, secret);
      return binanceClient.fetchBalance();
    } catch (e) {
      console.error(e)
    }
  }

  async createAlert(
    createAlertDto: CreateAlertDto,
  ): Promise<{ alertToken: string }> {
    try {
      const { token, pair, min, max } = createAlertDto;
      const user = await this._findUser({ token, enabled: true })
      const { key, secret } = await this._verifyUser(user.token);
      const binanceClient = this._createBinanceClient(key, secret);
      const alertToken = await this._createToken(key, secret);
      const alert = new this.alertsModel({
        pair,
        min,
        max,
        token: alertToken,
        userId: user.id
      });
      await alert.save();
      await binanceClient.fetchTicker(pair);
      return { alertToken };
    } catch (e) {
      console.error(e)
    }
  }

  async deleteToken(
    removeTokenDto: TokenDto
  ): Promise<void> {
    try {
      await this._findUser({ token: removeTokenDto.token, enabled: true });

      await this.userModel.findOneAndUpdate({ token: removeTokenDto.token, enabled: false });
    }catch (e) {
      console.error(e)
    }
  }

  private async _findUser(condition: { token: string, enabled: boolean }): Promise<IUser> {
    const user = await this.userModel.findOne(condition);

    if (!user) {
      throw new BadRequestException('error.invalid_token');
    }

    return user;
  }

  private async _verifyUser(token: string): Promise<{ key: string, secret: string }> {
    return await this.jwtService.verifyAsync(
      token,
      {
        secret: this.configService.get('JWT_SECRET_KEY'),
        publicKey: this.configService.get('JWT_PUBLIC_KEY'),
      },
    );
  }

  private async _createToken(key: string, secret: string): Promise<string> {
    return await this.jwtService.signAsync({ key, secret });
  }

  private _createBinanceClient(key: string, secret: string) {
    return new ccxt.binance({
      apiKey: key,
      secret: secret,
    })
  }

  private async _getClientFromAlertToken(alertToken: string): Promise<{ binanceClient: any, alert: any }> {
    const alert = await this.alertsModel.findOne({ token: alertToken });
    const user = await this.userModel.findById(alert.userId);
    const { key, secret } = await this._verifyUser(user.token);
    const binanceClient = this._createBinanceClient(key, secret);
    return { binanceClient, alert };
  }
}
