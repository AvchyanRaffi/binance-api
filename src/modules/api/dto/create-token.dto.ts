import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


export class CreateTokenDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly key: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly secret: string;
}
