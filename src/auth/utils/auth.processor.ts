import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process('send_email')
  async sendEmail(job: Job) {
    setTimeout(() => {
        this.logger.debug('Email sending...');
        this.logger.debug(job.data);
        this.logger.debug('Email sent!');
    }, 3000);
  }
}
