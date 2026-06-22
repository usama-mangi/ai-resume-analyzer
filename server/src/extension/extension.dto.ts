import { IsString, IsEmail, IsOptional, IsArray, IsBoolean, IsNumber, ValidateNested, IsIn, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApplicationBundleDto {
  @IsString()
  jobId: string;

  @IsString()
  @IsOptional()
  resumeId?: string;

  @IsString()
  @IsOptional()
  coverLetterId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateApplicationBundleDto {
  @IsString()
  @IsOptional()
  resumeId?: string;

  @IsString()
  @IsOptional()
  coverLetterId?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsIn(['draft', 'applied', 'phone_screen', 'interviewing', 'offer', 'rejected', 'accepted', 'withdrawn'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  referralContact?: string;

  @IsString()
  @IsOptional()
  nextSteps?: string;
}

export class CreateCommunicationLogDto {
  @IsString()
  applicationId: string;

  @IsString()
  @IsIn(['email', 'phone', 'message', 'in_person', 'video_call', 'linkedin', 'other'])
  type: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  direction?: 'inbound' | 'outbound';

  @IsDateString()
  @IsOptional()
  occurredAt?: string;

  @IsString()
  @IsOptional()
  outcome?: string;
}

export class CreateReferralDto {
  @IsString()
  applicationId: string;

  @IsString()
  employeeName: string;

  @IsString()
  @IsOptional()
  employeeEmail?: string;

  @IsString()
  @IsOptional()
  relationship?: string;

  @IsString()
  @IsIn(['not_requested', 'requested', 'agreed', 'declined', 'submitted'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  requestedAt?: string;

  @IsDateString()
  @IsOptional()
  respondedAt?: string;
}

export class ApplicationAnalyticsQueryDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;
}