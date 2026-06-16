import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { AiService } from '../ai/ai.service';
import { ResumeParserService } from '../resumes/resume-parser.service';
import { PdfToImageService } from '../resumes/pdf-to-image.service';
import { prepareInstructions } from '../ai/prompts';

@Injectable()
export class BatchesService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
    private aiService: AiService,
    private resumeParser: ResumeParserService,
    private pdfToImage: PdfToImageService,
  ) {}

  async create(
    userId: string,
    files: Express.Multer.File[],
    companyName: string,
    jobTitle: string,
    jobDescription: string,
  ) {
    const resumeIds: string[] = [];

    for (const file of files) {
      try {
        const format = this.resumeParser.validateFile(
          file.buffer,
          file.mimetype,
        );
        const { text: resumeText, preview } = await this.resumeParser.parse(
          file.buffer,
          format,
        );

        if (!resumeText) continue;

        const filePath = this.uploadService.saveFile(file);

        let imagePath: string | null = null;
        if (format === 'pdf') {
          const imageBuffer = await this.pdfToImage.convertPdfToImage(
            file.buffer,
          );
          if (imageBuffer) {
            imagePath = this.uploadService.saveBuffer(
              imageBuffer,
              `${file.originalname}.png`,
            );
          }
        }

        const resume = await this.prisma.resume.create({
          data: {
            userId,
            companyName: companyName || null,
            jobTitle,
            jobDescription: jobDescription || null,
            fileName: file.originalname,
            format,
            filePath,
            imagePath,
            textPreview: preview?.substring(0, 500) || null,
            textContent: resumeText,
            feedback: {},
          },
        });

        try {
          let feedback: Record<string, unknown> | null = null;
          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                  const aiResponse = await this.aiService.chat(
                    [
                      {
                        role: 'system',
                        content: `You are an expert ATS and resume analysis system. You MUST respond with a single valid JSON object and nothing else. The JSON MUST have ALL SIX top-level keys: "overallScore", "ATS", "toneAndStyle", "content", "structure", "skills". Omitting ANY key is a critical failure. If analysis cannot be completed, return the full structure with score 0.`,
                      },
                      {
                        role: 'user',
                        content: `Here is the resume content:
                        ${resumeText}
                        ${prepareInstructions({ jobTitle, jobDescription })}`,
                      },
                    ],
                { response_format: { type: 'json_object' }, temperature: 0.2 },
              );

              const parsed = this.aiService.parseAIResponse<Record<string, unknown>>(
                this.aiService.getResponseText(aiResponse),
              );
              feedback = this.aiService.validateFeedback(parsed);

              const fb = feedback as any;
              const hasContent = feedback && (
                fb.overallScore > 0 ||
                fb.ATS?.score > 0 ||
                fb.toneAndStyle?.score > 0 ||
                fb.content?.score > 0 ||
                fb.structure?.score > 0 ||
                fb.skills?.score > 0
              );
              if (hasContent) break;
            } catch (retryErr) {
              console.warn(`[BatchesService] Attempt ${attempt} for ${file.originalname} failed:`, retryErr);
              if (attempt === 3) throw retryErr;
            }
          }

          if (!feedback) {
            feedback = this.aiService.validateFeedback(null);
          }

          await this.prisma.resume.update({
            where: { id: resume.id },
            data: { feedback: feedback as any },
          });
        } catch (err) {
          // Store fallback feedback so the frontend never sees empty/broken data
          try {
            const fallbackFeedback = this.aiService.validateFeedback(null);
            await this.prisma.resume.update({
              where: { id: resume.id },
              data: { feedback: fallbackFeedback as any },
            });
          } catch { /* best effort */ }
        }

        resumeIds.push(resume.id);
      } catch (err) {
        // Skip failed files
      }
    }

    const batch = await this.prisma.batch.create({
      data: {
        userId,
        jobTitle,
        jobDescription: jobDescription || null,
        resumes: {
          create: resumeIds.map((resumeId) => ({ resumeId })),
        },
      },
    });

    return batch;
  }

  async findById(id: string, userId: string) {
    const batch = await this.prisma.batch.findFirst({
      where: { id, userId },
      include: {
        resumes: {
          include: {
            resume: {
              select: {
                id: true,
                companyName: true,
                jobTitle: true,
                jobDescription: true,
                fileName: true,
                format: true,
                filePath: true,
                imagePath: true,
                textPreview: true,
                feedback: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    return {
      ...batch,
      resumes: batch.resumes.map((br) => br.resume),
    };
  }
}
