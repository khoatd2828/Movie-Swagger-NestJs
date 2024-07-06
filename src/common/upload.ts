import multer, { diskStorage } from 'multer'
import { Request } from 'express';

// Định nghĩa interface cho file để giúp TypeScript hiểu được các thuộc tính của file
interface File {
    originalname: string;
}

export const upload = multer({
    storage: diskStorage({
        destination: (req: Request, file: File, callback) => {
            callback(null, process.cwd() + "/public/img");
        },
        filename: (req: Request, file: File, callback) => {
            const mSecond = new Date().getTime() + '-' + Math.round(Math.random() * 1E9);
            callback(null, `${mSecond}_${file.originalname}`);
        }
    })
});
