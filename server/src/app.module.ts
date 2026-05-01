import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { AiModule } from './ai/ai.module';
import { ResumesModule } from './resumes/resumes.module';
import { BatchesModule } from './batches/batches.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RateLimiterModule } from './common/rate-limiter/rate-limiter.module';
import { CompaniesModule } from './companies/companies.module';
import { DeadlinesModule } from './deadlines/deadlines.module';
import { JobsModule } from './jobs/jobs.module';
import { RedisModule } from './redis/redis.module';
import { LinkedInModule } from './linkedin/linkedin.module';
import { ReferencesModule } from './references/references.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { CoverLetterTemplatesModule } from './cover-letter-templates/cover-letter-templates.module';
import { ExtensionModule } from './extension/extension.module';
import { ApplicationTrackerModule } from './application-tracker/application-tracker.module';
import { InterviewPrepModule } from './interview-prep/interview-prep.module';
import { InterviewProcessModule } from './interview-process/interview-process.module';
import { OfferNegotiationModule } from './offer-negotiation/offer-negotiation.module';
import { PostOnboardingModule } from './post-onboarding/post-onboarding.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: resolve(process.env.UPLOAD_DIR || './uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UploadModule,
    AiModule,
    ResumesModule,
    BatchesModule,
    JobsModule,
    DeadlinesModule,
    CompaniesModule,
    RedisModule,
    RateLimiterModule,
    ReferencesModule,
    PortfolioModule,
    CoverLetterTemplatesModule,
    LinkedInModule,
    ExtensionModule,
    ApplicationTrackerModule,
    InterviewPrepModule,
    InterviewProcessModule,
    OfferNegotiationModule,
    PostOnboardingModule,
    UserModule,
  ],
})
export class AppModule {}