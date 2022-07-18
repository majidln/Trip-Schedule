import { IsString, IsOptional } from 'class-validator';

export class CreateTripDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}

export class EditTripDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
