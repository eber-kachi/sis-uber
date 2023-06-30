import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '../shared/services/config.service';

// const dir = process.env.UPLOAD_LOCATION;
const config = new ConfigService();
const dir = config.get('UPLOAD_LOCATION');
console.log('dir option ', dir);

// Multer configuration
export const multerConfig = {
  dest: 'public/' + dir,
};

// Multer upload options
export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize: (+process.env.MAX_FILE_SIZE || 2) * 1024 * 1024, //1 * 1024 * 1024 // 1MB,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest + '';
      // Create folder if doesn't exist
      if (!existsSync(uploadPath as string)) {
        mkdirSync(uploadPath as string);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
};
