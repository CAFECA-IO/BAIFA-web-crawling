import { Injectable } from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
// import { UpdateReviewDto } from "./dto/update-review.dto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class ReviewService {
  async create(createReviewDto: CreateReviewDto) {
    const data = {
      chain_id: createReviewDto.chain_id,
      target: createReviewDto.target,
      target_type: createReviewDto.target_type,
      created_timestamp: Math.floor(Date.now() / 1000),
      content: createReviewDto.content,
      stars: createReviewDto.stars,
      author_address: createReviewDto.author_address,
    };
    // Info: (20240307 - Gibbs) use prisma client to store review data
    await prisma.review_datas.create({
      data: data,
    });
    // Info: (20240307 - Gibbs) computing averageStars
    const averageStars = await prisma.review_datas.aggregate({
      _avg: {
        stars: true,
      },
      where: {
        target: createReviewDto.target,
        stars: {
          not: null,
        },
      },
    });
    // Info: (20240307 - Gibbs) update target address score
    await prisma.addresses.update({
      where: { address: createReviewDto.target },
      data: {
        score: averageStars._avg.stars,
      },
    });
    return {
      message: "Review created successfully",
      data: {
        content: data.content,
        stars: data.stars,
        author_address: data.author_address,
        created_timestamp: data.created_timestamp,
        transaction: createReviewDto.transaction,
      },
    };
  }
}

// findAll() {
//   return `This action returns all review`;
// }

// findOne(id: number) {
//   return `This action returns a #${id} review`;
// }

// update(id: number, updateReviewDto: UpdateReviewDto) {
//   return `This action updates a #${id} review`;
// }

// remove(id: number) {
//   return `This action removes a #${id} review`;
// }
