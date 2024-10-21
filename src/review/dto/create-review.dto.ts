import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  target: string;

  @IsNotEmpty()
  @IsString()
  target_type: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsInt()
  @Min(0)
  @Max(5)
  stars: number;

  @IsNotEmpty()
  @IsString()
  author_address: string;

  @IsNotEmpty()
  @IsString()
  transaction: string;

  @IsNotEmpty()
  @IsInt()
  chain_id: number;
}
