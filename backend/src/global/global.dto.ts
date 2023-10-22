import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class QuerySchemaDto {
  @IsInt()
  @IsOptional()
  @Transform((obj) => parseInt(obj.value))
  @Min(0)
  @ApiProperty({
    description: 'The page of pagination.',
    minimum: 0,
    example: 2,
    required: false,
    type: Number,
  })
  readonly page: number = 0;

  @IsInt()
  @IsOptional()
  @Transform((obj) => parseInt(obj.value))
  @Min(1)
  @Max(100)
  @ApiProperty({
    name: 'limit',
    description: 'The limit elements per page.',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  readonly limit: number = 100;

  @Expose({})
  getSkip(): number {
    return (this.page - 1) * this.limit;
  }
}
