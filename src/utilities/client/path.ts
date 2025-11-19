'use client';

import path from 'path';

export function normalizeUploadPath(image: string | undefined) {
  let imagePath = image || '/images/app-icon.png';
  
  // if (image && /^[^\\/]/.test(image)) {
  if (image && /^(?!\/|\\|https?:\/\/)/.test(image)) {
    const normalizedImage = image.replace(/\\/g, '/');
    imagePath = path.join('/uploads', normalizedImage);
  }

  return imagePath;
}
