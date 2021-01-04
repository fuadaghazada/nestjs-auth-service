import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process('send_verification_email')
  async sendVerificationCode(job: Job) {
    setTimeout(() => {
        this.logger.debug('Email sending...');
        this.logger.debug(`To: ${job.data.email}`);
        this.logger.debug(`Content: ${job.data.code}`);
        this.logger.debug('Email sent!');
    }, 3000);
  }
}
