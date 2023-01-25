import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  method1() {}

  method2() {}
}

export class UserDto extends LoginDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;
}