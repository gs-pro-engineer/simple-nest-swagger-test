import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TasksService } from './task.service';

@Module({
  controllers: [TaskController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TaskModule {}
