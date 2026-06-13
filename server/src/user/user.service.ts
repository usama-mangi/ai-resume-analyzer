import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calculateProfileCompletion } from './profile-completion';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    let profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) {
      profile = await this.prisma.userProfile.create({ data: { userId } });
    }

    const completion = calculateProfileCompletion(user, profile as any);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone,
        headline: user.headline,
        summary: user.summary,
        location: user.location,
        linkedinUrl: user.linkedinUrl,
        githubUrl: user.githubUrl,
        websiteUrl: user.websiteUrl,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt,
      },
      profile: {
        education: profile.education || [],
        experience: profile.experience || [],
        projects: profile.projects || [],
        skills: profile.skills || [],
        certifications: profile.certifications || [],
        languages: profile.languages || [],
      },
      completion,
    };
  }

  async updateUser(userId: string, data: {
    phone?: string;
    headline?: string;
    summary?: string;
    location?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    name?: string;
  }) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }

  async updateProfile(userId: string, data: {
    education?: any[];
    experience?: any[];
    projects?: any[];
    skills?: string[];
    certifications?: any[];
    languages?: string[];
  }) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }

  async completeOnboarding(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
    });
  }
}
