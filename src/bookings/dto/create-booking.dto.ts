import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class CreateBookingDto {
  @IsNumber()
  resourceId: number;

  @IsOptional()
  @IsBoolean()
  isImmediate?: boolean;

  @IsNumber()
  startTime: string;

  @IsNumber()
  endTime: string;
}
