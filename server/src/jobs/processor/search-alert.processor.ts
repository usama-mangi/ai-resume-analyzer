import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { JobsService } from '../jobs.service';

interface SearchAlertJobData {
  userId: string;
  searchId: string;
}

@Processor('search-alerts', { concurrency: 5 })
export class SearchAlertProcessor extends WorkerHost {
  private readonly logger = new Logger(SearchAlertProcessor.name);

  constructor(private readonly jobsService: JobsService) {
    super();
  }

  async process(job: Job<SearchAlertJobData>): Promise<any> {
    const { userId, searchId } = job.data;
    this.logger.log(`Processing search alert for user ${userId}, search ${searchId}`);

    try {
      // Run the saved search
      const jobs = await this.jobsService.runSavedSearch(searchId, userId);
      
      // Check for new jobs (not seen before)
      // In a real implementation, you'd compare with previous run results
      
      // TODO: Send notification (email/push) to user with new jobs
      // await this.notificationService.sendSearchAlert(userId, searchId, newJobs);
      
      this.logger.log(`Search alert completed for user ${userId}, found ${jobs.length} jobs`);
      
      return { success: true, jobsFound: jobs.length };
    } catch (error) {
      this.logger.error(`Search alert failed for user ${userId}:`, error);
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.debug(`Search alert job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Search alert job ${job.id} failed:`, error);
  }

  @OnWorkerEvent('stalled')
  onStalled(job: Job) {
    this.logger.warn(`Search alert job ${job.id} stalled`);
  }
}