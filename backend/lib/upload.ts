import { existsSync } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import { extname, join } from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function saveFile(file: File): Promise<string> {
  const ext = extname(file.name) || ".bin";
  const filename = `${uuidv4()}${ext.startsWith(".") ? ext : `.${ext}`}`;

  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
}

export async function deleteFile(path: string): Promise<void> {
  const filename = path.replace(/^\/uploads\//, "");
  const filepath = join(UPLOAD_DIR, filename);

  try {
    await unlink(filepath);
  } catch {
    // File may not exist
  }
}
