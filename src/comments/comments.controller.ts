import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { CustomerCommenttGuard } from "../common/guards/customer-comment.guard";

@ApiTags("comments") // Swagger tagi
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(CustomerCommenttGuard)
  @Post()
  @ApiOperation({ summary: "Create a new comment" })
  @ApiResponse({
    status: 201,
    description: "The comment has been successfully created.",
  })
  @ApiBody({ type: CreateCommentDto })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: "Retrieve all comments" })
  @ApiResponse({ status: 200, description: "List of all comments" })
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Retrieve a single comment by ID" })
  @ApiParam({ name: "id", type: "string", description: "Comment ID" })
  @ApiResponse({ status: 200, description: "The found comment" })
  findOne(@Param("id") id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a comment by ID" })
  @ApiParam({ name: "id", type: "string", description: "Comment ID" })
  @ApiResponse({
    status: 200,
    description: "The comment has been successfully updated.",
  })
  @ApiBody({ type: UpdateCommentDto })
  update(@Param("id") id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a comment by ID" })
  @ApiParam({ name: "id", type: "string", description: "Comment ID" })
  @ApiResponse({
    status: 200,
    description: "The comment has been successfully deleted.",
  })
  remove(@Param("id") id: string) {
    return this.commentsService.remove(+id);
  }
}
