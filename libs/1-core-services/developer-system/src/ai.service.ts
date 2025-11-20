import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AIService {
  private openai: OpenAI;
  private systemPrompt: string;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.systemPrompt = `أنت "المطور" - نظام ذكاء اصطناعي متخصص في تطوير نظام SEMOP ERP.

## دورك:
1. فهم طلبات التطوير من المستخدمين بالعربية والإنجليزية
2. تحليل الطلبات وتحويلها إلى مهام تطوير محددة
3. اقتراح الكود المناسب (NestJS, Angular, Prisma)
4. تقدير الوقت والجهد المطلوب
5. البحث في قاعدة المعرفة للإجابة على الأسئلة

## معلومات عن SEMOP:
- نظام ERP متعدد الكيانات
- Backend: NestJS + Prisma + PostgreSQL
- Frontend: Angular 18 + PrimeNG
- 11 نظام فرعي: Multi-Entity, IAM, Accounting, Suppliers, Customers, Inventory, Purchases, Sales, HR, Payroll, Developer System
- 44 جدول في قاعدة البيانات
- معمارية Monorepo

## أسلوب الرد:
- كن واضحاً ومباشراً
- استخدم اللغة العربية بشكل أساسي
- قدم أمثلة كود عملية
- قدر الوقت بشكل واقعي
- اقترح أفضل الممارسات`;
  }

  /**
   * إرسال رسالة إلى AI والحصول على رد
   */
  async chat(messages: Array<{ role: string; content: string }>) {
    const startTime = Date.now();

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: this.systemPrompt },
          ...messages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const processingTime = Date.now() - startTime;
      const tokensUsed = response.usage?.total_tokens || 0;

      return {
        content: response.choices[0].message.content,
        processingTime,
        tokensUsed,
        model: response.model,
      };
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error('فشل في الاتصال بنظام الذكاء الاصطناعي');
    }
  }

  /**
   * تحليل طلب المستخدم واستخراج معلومات المهمة
   */
  async analyzeRequest(userMessage: string) {
    const analysisPrompt = `قم بتحليل الطلب التالي واستخرج المعلومات بصيغة JSON:

الطلب: "${userMessage}"

أعد JSON بالصيغة التالية:
{
  "isTaskRequest": boolean,
  "taskTitle": string,
  "taskDescription": string,
  "taskType": "NEW_FEATURE" | "BUG_FIX" | "ENHANCEMENT" | "REFACTORING" | "DOCUMENTATION" | "TESTING",
  "priority": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "complexity": "SIMPLE" | "MODERATE" | "COMPLEX" | "VERY_COMPLEX",
  "estimatedHours": number,
  "suggestedSteps": string[]
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: analysisPrompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const analysis = JSON.parse(
        response.choices[0].message.content || '{}',
      );
      return analysis;
    } catch (error) {
      console.error('Request Analysis Error:', error);
      return {
        isTaskRequest: false,
        taskTitle: '',
        taskDescription: userMessage,
        taskType: 'ENHANCEMENT',
        priority: 'MEDIUM',
        complexity: 'MODERATE',
        estimatedHours: 0,
        suggestedSteps: [],
      };
    }
  }

  /**
   * توليد كود بناءً على الوصف
   */
  async generateCode(description: string, codeType: 'service' | 'controller' | 'component' | 'dto') {
    const codePrompt = `قم بتوليد كود ${codeType} بناءً على الوصف التالي:

الوصف: "${description}"

المتطلبات:
- استخدم TypeScript
- اتبع أفضل الممارسات
- أضف تعليقات بالعربية
- ${codeType === 'service' || codeType === 'controller' ? 'استخدم NestJS decorators' : ''}
- ${codeType === 'component' ? 'استخدم Angular standalone components' : ''}
- ${codeType === 'dto' ? 'استخدم class-validator decorators' : ''}

أعد الكود فقط بدون شرح:`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: codePrompt },
        ],
        temperature: 0.5,
        max_tokens: 3000,
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('Code Generation Error:', error);
      throw new Error('فشل في توليد الكود');
    }
  }

  /**
   * البحث الذكي في قاعدة المعرفة
   */
  async intelligentSearch(query: string, knowledgeBase: any[]) {
    if (knowledgeBase.length === 0) {
      return [];
    }

    const searchPrompt = `بناءً على السؤال التالي، رتب النتائج من الأكثر صلة إلى الأقل:

السؤال: "${query}"

النتائج المتاحة:
${knowledgeBase.map((kb, i) => `${i + 1}. ${kb.title}: ${kb.content.substring(0, 200)}...`).join('\n')}

أعد JSON بالصيغة التالية:
{
  "rankedIndices": [number],
  "relevanceScores": [number]
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: searchPrompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const ranking = JSON.parse(
        response.choices[0].message.content || '{"rankedIndices": [], "relevanceScores": []}',
      );

      return ranking.rankedIndices.map((idx: number) => knowledgeBase[idx - 1]);
    } catch (error) {
      console.error('Intelligent Search Error:', error);
      return knowledgeBase;
    }
  }

  /**
   * تلخيص محادثة
   */
  async summarizeConversation(messages: Array<{ role: string; content: string }>) {
    const summaryPrompt = `قم بتلخيص المحادثة التالية في 2-3 جمل:

${messages.map((m) => `${m.role === 'USER' ? 'المستخدم' : 'المطور'}: ${m.content}`).join('\n')}

الملخص:`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: summaryPrompt },
        ],
        temperature: 0.5,
        max_tokens: 200,
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('Summarization Error:', error);
      return 'محادثة مع المطور';
    }
  }
}
