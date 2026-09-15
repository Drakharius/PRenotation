import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class CreateBookingDto {
  @IsNumber()
  resourceId: number;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsBoolean()
  isImmediate?: boolean;
}
