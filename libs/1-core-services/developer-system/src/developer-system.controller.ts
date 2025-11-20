import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DeveloperSystemService } from './developer-system.service';
import { AIService } from './ai.service';

@Controller('developer-system')
export class DeveloperSystemController {
  constructor(
    private readonly devSystemService: DeveloperSystemService,
    private readonly aiService: AIService,
  ) {}

  // ========================================
  // 1. المحادثات (Conversations)
  // ========================================

  @Post('conversations')
  async createConversation(
    @Body() body: { userId: string; title?: string },
  ) {
    const title = body.title || 'محادثة جديدة';
    return this.devSystemService.createConversation(body.userId, title);
  }

  @Get('conversations/user/:userId')
  async getUserConversations(@Param('userId') userId: string) {
    return this.devSystemService.getUserConversations(userId);
  }

  @Get('conversations/:id')
  async getConversation(@Param('id') id: string) {
    return this.devSystemService.getConversation(id);
  }

  @Delete('conversations/:id')
  async deleteConversation(@Param('id') id: string) {
    return this.devSystemService.deleteConversation(id);
  }

  // ========================================
  // 2. الدردشة مع AI (Chat)
  // ========================================

  @Post('chat')
  async chat(
    @Body()
    body: {
      conversationId: string;
      userId: string;
      message: string;
    },
  ) {
    const startTime = Date.now();

    // 1. حفظ رسالة المستخدم
    await this.devSystemService.addMessage(
      body.conversationId,
      'USER',
      body.message,
    );

    // 2. الحصول على سياق المحادثة
    const conversation = await this.devSystemService.getConversation(
      body.conversationId,
    );
    const messages = conversation.messages.map((m) => ({
      role: m.role.toLowerCase(),
      content: m.content,
    }));

    // 3. البحث في قاعدة المعرفة
    const knowledgeResults = await this.devSystemService.searchKnowledge(
      body.message,
    );

    // 4. إضافة المعرفة إلى السياق إذا وجدت
    if (knowledgeResults.length > 0) {
      const knowledgeContext = knowledgeResults
        .map((kb) => `${kb.title}: ${kb.content}`)
        .join('\n\n');
      messages.push({
        role: 'system',
        content: `معلومات من قاعدة المعرفة:\n${knowledgeContext}`,
      });
    }

    // 5. الحصول على رد من AI
    const aiResponse = await this.aiService.chat(messages);

    // 6. حفظ رد AI
    await this.devSystemService.addMessage(
      body.conversationId,
      'ASSISTANT',
      aiResponse.content,
      {
        model: aiResponse.model,
        tokensUsed: aiResponse.tokensUsed,
        processingTime: aiResponse.processingTime,
      },
    );

    // 7. تحليل الطلب لمعرفة إذا كان يحتاج إنشاء مهمة
    const analysis = await this.aiService.analyzeRequest(body.message);

    let task = null;
    if (analysis.isTaskRequest) {
      task = await this.devSystemService.createTask({
        conversationId: body.conversationId,
        title: analysis.taskTitle,
        description: analysis.taskDescription,
        type: analysis.taskType,
        priority: analysis.priority,
        complexity: analysis.complexity,
        estimatedHours: analysis.estimatedHours,
        createdBy: body.userId,
      });
    }

    // 8. تسجيل التحليلات
    await this.devSystemService.logAnalytics({
      userId: body.userId,
      conversationId: body.conversationId,
      eventType: 'MESSAGE_SENT',
      eventData: {
        messageLength: body.message.length,
        hasKnowledge: knowledgeResults.length > 0,
        taskCreated: !!task,
      },
      processingTime: Date.now() - startTime,
      tokensUsed: aiResponse.tokensUsed,
    });

    return {
      message: aiResponse.content,
      task,
      knowledgeUsed: knowledgeResults.length,
      processingTime: aiResponse.processingTime,
    };
  }

  // ========================================
  // 3. مهام التطوير (Tasks)
  // ========================================

  @Post('tasks')
  async createTask(
    @Body()
    body: {
      conversationId?: string;
      title: string;
      description: string;
      type: string;
      priority?: string;
      estimatedHours?: number;
      complexity?: string;
      suggestedCode?: string;
      filePath?: string;
      createdBy: string;
    },
  ) {
    return this.devSystemService.createTask(body);
  }

  @Get('tasks')
  async getAllTasks(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('type') type?: string,
  ) {
    return this.devSystemService.getAllTasks({ status, priority, type });
  }

  @Get('tasks/:id')
  async getTask(@Param('id') id: string) {
    return this.devSystemService.getTask(id);
  }

  @Patch('tasks/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body()
    body: {
      status: string;
      assignedTo?: string;
      startedAt?: string;
      completedAt?: string;
    },
  ) {
    return this.devSystemService.updateTaskStatus(id, body.status, {
      assignedTo: body.assignedTo,
      startedAt: body.startedAt ? new Date(body.startedAt) : undefined,
      completedAt: body.completedAt ? new Date(body.completedAt) : undefined,
    });
  }

  @Delete('tasks/:id')
  async deleteTask(@Param('id') id: string) {
    return this.devSystemService.deleteTask(id);
  }

  // ========================================
  // 4. توليد الكود (Code Generation)
  // ========================================

  @Post('generate-code')
  async generateCode(
    @Body()
    body: {
      description: string;
      codeType: 'service' | 'controller' | 'component' | 'dto';
      userId: string;
    },
  ) {
    const code = await this.aiService.generateCode(
      body.description,
      body.codeType,
    );

    // تسجيل الحدث
    await this.devSystemService.logAnalytics({
      userId: body.userId,
      eventType: 'CODE_GENERATED',
      eventData: {
        codeType: body.codeType,
        descriptionLength: body.description.length,
        codeLength: code.length,
      },
    });

    return { code };
  }

  // ========================================
  // 5. قاعدة المعرفة (Knowledge Base)
  // ========================================

  @Post('knowledge')
  async addKnowledge(
    @Body()
    body: {
      title: string;
      content: string;
      category: string;
      tags: string[];
      source?: string;
      language?: string;
      createdBy: string;
    },
  ) {
    return this.devSystemService.addKnowledge(body);
  }

  @Get('knowledge/search')
  async searchKnowledge(
    @Query('q') query: string,
    @Query('category') category?: string,
  ) {
    return this.devSystemService.searchKnowledge(query, category);
  }

  @Get('knowledge/category/:category')
  async getKnowledgeByCategory(@Param('category') category: string) {
    return this.devSystemService.getKnowledgeByCategory(category);
  }

  // ========================================
  // 6. الإحصائيات (Analytics)
  // ========================================

  @Get('analytics/stats')
  async getStats(@Query('userId') userId?: string) {
    return this.devSystemService.getUsageStats(userId);
  }

  // ========================================
  // 7. الإعدادات (Settings)
  // ========================================

  @Get('settings')
  async getSettings() {
    return this.devSystemService.getSettings();
  }

  @Patch('settings/:id')
  async updateSettings(
    @Param('id') id: string,
    @Body() body: any,
    @Query('updatedBy') updatedBy: string,
  ) {
    return this.devSystemService.updateSettings(id, body, updatedBy);
  }
}
