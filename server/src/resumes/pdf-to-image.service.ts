import { Injectable } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execFileAsync = promisify(execFile);

@Injectable()
export class PdfToImageService {
  async convertPdfToImage(buffer: Buffer): Promise<Buffer | null> {
    const tmpDir = os.tmpdir();
    const pdfPath = path.join(tmpDir, `${Date.now()}-input.pdf`);
    const outputPrefix = path.join(tmpDir, `${Date.now()}-page`);

    try {
      fs.writeFileSync(pdfPath, buffer);

      await execFileAsync('pdftoppm', [
        '-f', '1',
        '-l', '1',
        '-png',
        '-r', '150',
        '-singlefile',
        pdfPath,
        outputPrefix,
      ]);

      const pngPath = `${outputPrefix}.png`;
      if (!fs.existsSync(pngPath)) {
        return null;
      }

      const pngBuffer = fs.readFileSync(pngPath);
      fs.unlinkSync(pngPath);
      return pngBuffer;
    } catch (err) {
      console.error('PDF to image conversion failed:', err);
      return null;
    } finally {
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }
  }
}