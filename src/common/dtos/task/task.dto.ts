import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TaskDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @ApiProperty()
    @IsString()
    readonly description: string;

    method1() { }

    method2() { }
}