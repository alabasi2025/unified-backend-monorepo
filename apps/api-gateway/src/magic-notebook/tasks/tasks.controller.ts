import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// افتراض وجود DTOs و Service
// import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
// import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  // يجب حقن TasksService هنا
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'إنشاء مهمة جديدة' })
  @ApiResponse({ status: 201, description: 'تم إنشاء المهمة بنجاح.' })
  create(@Body() createTaskDto: CreateTaskDto) {
    // يجب أن تكون CreateTaskDto موجودة للـ validation
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'الحصول على جميع المهام' })
  @ApiResponse({ status: 200, description: 'قائمة المهام.' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'الحصول على مهمة واحدة بواسطة المعرف' })
  @ApiResponse({ status: 200, description: 'تفاصيل المهمة.' })
  @ApiResponse({ status: 404, description: 'المهمة غير موجودة.' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تحديث مهمة بواسطة المعرف' })
  @ApiResponse({ status: 200, description: 'تم تحديث المهمة بنجاح.' })
  @ApiResponse({ status: 404, description: 'المهمة غير موجودة.' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    // يجب أن تكون UpdateTaskDto موجودة للـ validation
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content هو الرمز المناسب للحذف الناجح
  @ApiOperation({ summary: 'حذف مهمة بواسطة المعرف' })
  @ApiResponse({ status: 204, description: 'تم حذف المهمة بنجاح.' })
  @ApiResponse({ status: 404, description: 'المهمة غير موجودة.' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
