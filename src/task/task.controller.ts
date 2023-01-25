import { Controller, Get, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TaskDto } from 'src/common/dtos/task/task.dto';
import { TasksService } from './task.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common/decorators';

@ApiTags('Tasks Management')
@Controller('tasks')
export class TaskController {
  constructor(
    private taskService: TasksService
  ) {}

  @Get('')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: TaskDto, isArray: true })
  async getTasks(@Headers() headers): Promise<TaskDto[]> {
    return this.taskService.findAll();
  }
}
