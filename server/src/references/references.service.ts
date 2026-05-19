import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Reference } from '@prisma/client';

export type ReferenceStatus = 'not_contacted' | 'contacted' | 'agreed' | 'declined';

export interface CreateReferenceDto {
  name: string;
  title: string;
  company: string;
  email: string;
  phone?: string;
  relationship: string;
  yearsKnown?: number;
  notes?: string;
  status?: ReferenceStatus;
}

export interface UpdateReferenceDto {
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  relationship?: string;
  yearsKnown?: number;
  notes?: string;
  status?: ReferenceStatus;
}

@Injectable()
export class ReferencesService {
  private readonly logger = new Logger(ReferencesService.name);

  constructor(private prisma: PrismaService) {}

  async createReference(userId: string, data: CreateReferenceDto): Promise<Reference> {
    const reference = await this.prisma.reference.create({
      data: {
        userId,
        name: data.name,
        title: data.title,
        company: data.company,
        email: data.email,
        phone: data.phone,
        relationship: data.relationship,
        yearsKnown: data.yearsKnown,
        notes: data.notes,
        status: data.status ?? 'not_contacted',
      },
    });

    this.logger.log(`Created reference "${reference.name}" for user ${userId}`);
    return reference;
  }

  async getReferences(userId: string): Promise<Reference[]> {
    return this.prisma.reference.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReferenceById(id: string, userId: string): Promise<Reference> {
    const reference = await this.prisma.reference.findFirst({
      where: { id, userId },
    });

    if (!reference) {
      throw new NotFoundException('Reference not found');
    }

    return reference;
  }

  async updateReference(
    id: string,
    userId: string,
    data: UpdateReferenceDto,
  ): Promise<Reference> {
    const existing = await this.prisma.reference.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Reference not found');
    }

    const reference = await this.prisma.reference.update({
      where: { id },
      data,
    });

    this.logger.log(`Updated reference "${reference.name}" for user ${userId}`);
    return reference;
  }

  async deleteReference(id: string, userId: string): Promise<void> {
    const existing = await this.prisma.reference.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Reference not found');
    }

    await this.prisma.reference.delete({ where: { id } });
    this.logger.log(`Deleted reference "${existing.name}" for user ${userId}`);
  }

  async updateStatus(
    id: string,
    userId: string,
    status: ReferenceStatus,
  ): Promise<Reference> {
    const existing = await this.prisma.reference.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Reference not found');
    }

    const reference = await this.prisma.reference.update({
      where: { id },
      data: { status },
    });

    this.logger.log(
      `Updated reference "${reference.name}" status to "${status}" for user ${userId}`,
    );
    return reference;
  }
}
