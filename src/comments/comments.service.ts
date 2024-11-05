import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment) private readonly commentModel: typeof Comment){}
  async create(createCommentDto: CreateCommentDto) {
    return await this.commentModel.create(createCommentDto);
  }

  async findAll() {
    return await this.commentModel.findAll({include:{all:true}});
  }

  async findOne(id: number) {
    const comment = await this.commentModel.findByPk(id);
    if (!comment) {
      throw new NotFoundException(`ID: ${id} comment mavjud emas!`);
    }
    return await this.commentModel.findOne({ include: { all: true } });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentModel.findByPk(id);
    if (!comment) {
      throw new NotFoundException(`ID: ${id} comment mavjud emas!`);
    }
    return await comment.update(updateCommentDto);
  }

  async remove(id: number) {
    const comment = await this.commentModel.findByPk(id);
    if (!comment) {
      throw new NotFoundException(`ID: ${id} comment mavjud emas!`);
    }
    await comment.destroy();
    return comment;
  }
}
