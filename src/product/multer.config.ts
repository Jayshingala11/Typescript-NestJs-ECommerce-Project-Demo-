import { Request } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';

export const fileStorage = diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    console.log("Hello");
    
    cb(null, path.resolve(__dirname, '..', 'images'));
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const fileName = `${new Date().toISOString()}-${file.originalname}`
      .trim()
      .replace(/:/g, '-');
    cb(null, fileName);
  },
});

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
