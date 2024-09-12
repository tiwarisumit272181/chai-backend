import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use absolute path for the destination directory
    const dir = path.resolve(__dirname, '../../public/temp');
    
    // Ensure the directory exists; if not, create it
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

export const upload = multer({
  storage: storage
});

