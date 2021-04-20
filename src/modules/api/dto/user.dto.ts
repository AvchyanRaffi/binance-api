import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  readonly token: string;

  constructor(user) {
    this.token = user.token;
  }
}
