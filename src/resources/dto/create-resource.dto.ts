import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateResourceDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  resource: string;
}
