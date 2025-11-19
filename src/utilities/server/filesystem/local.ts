import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.join(__dirname, '../../../..');

const UPLOAD_DIR = path.join(PROJECT_ROOT, 'public/uploads');

/**
 * Upload file to local
 * 
 * @param file 
 * @param directory 
 * @returns 
 */
export const upload = async (
  file: File,
  directory: string = '',
): Promise<any> => {
  try {
    const filename = `${Date.now()}_${file.name}`;
    
    const uploadDir = path.join(UPLOAD_DIR, directory);
    const filePath = path.join(uploadDir, filename);
    const publicFilePath = path.join(directory, filename);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = await file.bytes();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    return publicFilePath;
  } catch (error: any) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

/**
 * Removes local file
 * 
 * @param filePath 
 */
export const remove = async (
  filePath: string,
): Promise<void> => {
  try {
    const fullPath = path.join(UPLOAD_DIR, filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error: any) {
    throw new Error(`Error removing file: ${error.message}`);
  }
};

/**
 * Updates local file
 * 
 * @param oldFilePath 
 * @param newFile 
 * @param directory 
 * @returns 
 */
export const update = async (
  oldFilePath: string | null,
  newFile: File,
  directory: string = '',
): Promise<any> => {
  try {
    if (oldFilePath) await remove(oldFilePath);

    return await upload(newFile, directory);
  } catch (error: any) {
    throw new Error(`Error updating file: ${error.message}`);
  }
};
