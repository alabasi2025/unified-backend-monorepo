import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {
  constructor(private eventEmitter: EventEmitter2) {}

  async sendGeneActivationNotification(geneId: string, isActive: boolean) {
    this.eventEmitter.emit('gene.status.changed', {
      geneId,
      isActive,
      timestamp: new Date(),
    });
  }
}
