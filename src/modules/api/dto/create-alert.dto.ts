import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ToInt } from '../../../decorators/transform.decorator';

export class CreateAlertDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly pair: string;

  @ApiProperty({
    type: Number,
  })
  @ToInt()
  @IsNumber()
  readonly min: number;

  @ApiProperty({
    type: Number,
  })
  @ToInt()
  @IsNumber()
  readonly max: number;
}

