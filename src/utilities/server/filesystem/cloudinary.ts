import { getStorage } from './';

/**
 * Upload file to Cloudinary
 * 
 * @param file - Multer file
 * @param directory - Directory path
 * @returns 
 */
export const upload = async (
  file: File,
  directory: string,
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const buffer = await file.bytes();

      const uploadOptions: any = {
        folder: directory,
        format: 'webp',
        resource_type: 'image',
        transformation: [],
      };

      const storage = await getStorage();
      const stream = storage.uploader.upload_stream(uploadOptions, (error: any, result: any) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      });

      stream.end(buffer);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Remove file from Cloudinary
 * 
 * @param filePath - Public Cloudinary URL or relative path
 * @returns 
 */
export const remove = async (
  filePath: string,
): Promise<void> => {
  try {
    const parsed = new URL(filePath);
    const parts = parsed.pathname.split('/');
    const publicId = parts.slice(-2).join('/').replace(/\.[^/.]+$/, '').replace(/\.webp$/, '');

    const storage = await getStorage();
    await storage.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    });
  } catch (error: any) {
    throw new Error(`Error removing Cloudinary file: ${error.message}`);
  }
};

/**
 * Update Cloudinary file
 * 
 * @param oldFilePath 
 * @param newFile 
 * @param directory 
 * @returns 
 */
export const update = async (
  oldFilePath: string | null,
  newFile: File,
  directory: string,
): Promise<string> => {
  try {
    if (oldFilePath) await remove(oldFilePath);
    return await upload(newFile, directory);
  } catch (error: any) {
    throw new Error(`Error updating Cloudinary file: ${error.message}`);
  }
};
