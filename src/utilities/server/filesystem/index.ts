/**
 * Cloud storage library.
 */
export async function getStorage() {
  let driver = process.env.STORAGE_DRIVER || 'local';
  let storage: any = {};

  switch (driver) {
    case 'cloudinary':
      const cloudinary = (await import('cloudinary')).v2;

      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      storage = cloudinary;
      break;
    
    case 'gdrive':
      break;
    
    default:
      driver = 'local';
      break;
  }

  storage.driver = driver;

  return storage;
}

type StorageAction = 'upload' | 'remove' | 'update';
const doFile = async (action: StorageAction, ...args: any[]): Promise<any> => {
  const storage = await getStorage();
  const medium = await import(`./${storage.driver}`);

  if (typeof medium[action] !== 'function') {
    throw new Error(
      `Driver '${storage.driver}' does not implement action '${action}()'`
    );
  }

  return await medium[action](...args);
};

export const upload = async (...args: UploadArgs) => await doFile('upload', ...args);
export const remove = async (...args: RemoveArgs) => await doFile('remove', ...args);
export const update = async (...args: UpdateArgs) => await doFile('update', ...args);

export type UploadArgs = [file: File, directory?: string];
export type UpdateArgs = [oldFilePath: string | null | undefined, newFile: File, directory?: string];
export type RemoveArgs = [filePath: string];
