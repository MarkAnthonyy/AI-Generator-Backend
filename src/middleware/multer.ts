import multer from 'multer';
import BadRequestError from '../errors/BadRequestError';

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype.startsWith('audio/')
  ) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only image, video, and audio files are allowed'));
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 100MB
  fileFilter,
});
