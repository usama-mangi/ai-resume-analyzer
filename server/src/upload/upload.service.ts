import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private uploadDir: string;

  constructor(private configService: ConfigService) {
    const dir = this.configService.get<string>('UPLOAD_DIR') || './uploads';
    this.uploadDir = path.resolve(dir);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    console.log(`Upload directory: ${this.uploadDir}`);
  }

  saveFile(file: Express.Multer.File): string {
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(this.uploadDir, filename);
    fs.writeFileSync(filepath, file.buffer);
    return filename;
  }

  saveBuffer(buffer: Buffer, filename: string): string {
    const uniqueName = `${Date.now()}-${filename}`;
    const filepath = path.join(this.uploadDir, uniqueName);
    fs.writeFileSync(filepath, buffer);
    return uniqueName;
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }

  deleteFile(filename: string): void {
    const filepath = path.join(this.uploadDir, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
}