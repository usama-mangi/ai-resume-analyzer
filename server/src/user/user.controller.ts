import { Controller, Get, Patch, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { UserService } from './user.service';

@Controller('profile')
@UseGuards(SessionGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getProfile(@Request() req) {
    return this.userService.getProfile(req.user.userId);
  }

  @Patch()
  async updateProfile(@Request() req, @Body() body: {
    education?: any[];
    experience?: any[];
    skills?: string[];
    certifications?: any[];
    languages?: string[];
  }) {
    return this.userService.updateProfile(req.user.userId, body);
  }

  @Patch('user')
  async updateUser(@Request() req, @Body() body: {
    phone?: string;
    headline?: string;
    summary?: string;
    location?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    name?: string;
  }) {
    return this.userService.updateUser(req.user.userId, body);
  }

  @Post('complete-onboarding')
  async completeOnboarding(@Request() req) {
    return this.userService.completeOnboarding(req.user.userId);
  }
}
