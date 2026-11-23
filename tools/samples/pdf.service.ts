import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import type { Queue } from "bullmq";
import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const UPLOAD_DIR = join(process.cwd(), "uploads");

/** Stores uploaded PDFs and queues conversion jobs. */
@Injectable()
export class PdfService {
  constructor(
    @InjectQueue("pdf_queue") private readonly pdfQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  async create(files: UploadedFile[], createdById?: string): Promise<CreateConversionsResponse> {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const conversions = await Promise.all(
      files.map(async (file) => {
        const filePath = join(UPLOAD_DIR, randomUUID());
        await writeFile(filePath, file.content);
        // one job per file; retried up to 3 times
        await this.pdfQueue.add("convert", { filePath }, { attempts: 3 });
        return this.prisma.pdfConversion.create({
          data: { originalName: file.originalName, filePath, createdById },
        });
      }),
    );
    return { ids: conversions.map((conversion) => conversion.id) };
  }

  async findOne(id: string): Promise<Conversion> {
    const row = await this.prisma.pdfConversion.findUnique({ where: { id }, include: { pages: true } });
    if (!row) throw new NotFoundException(`Conversion ${id} not found`);
    return toConversion(row);
  }
}
