import { Controller, Post, Body, Param } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
// import { UpdateReviewDto } from "./dto/update-review.dto";

@Controller("app/chains")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(":chain_id/addresses/:address_id/review_data")
  create(
    @Param("chain_id") chain_id: string,
    @Param("address_id") address_id: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.create(createReviewDto);
  }

  // @Get()
  // findAll() {
  //   return this.reviewService.findAll();
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.reviewService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateReviewDto: UpdateReviewDto) {
  //   return this.reviewService.update(+id, updateReviewDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.reviewService.remove(+id);
  // }
}
