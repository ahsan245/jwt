import { Request, Response, NextFunction } from 'express';
import * as fileUpload from 'express-fileupload';

export function FileUploadMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res?.status(400).send('No files were uploaded.'); // Use optional chaining to access the status property
  }

  const uploadedFile = req.files.userImage as fileUpload.UploadedFile;

  // Define your file validation logic here
  const validExts = ['.png', '.jpg', '.jpeg'];
  if (!validExts.includes('.' + uploadedFile.name.split('.').pop())) {
    return res?.status(400).send('Only .png, .jpg, and .jpeg formats are allowed.'); // Use optional chaining to access the status property
  }

  // Define your file size limit here (1MB in this example)
  const fileSizeLimit = 1 * 1024 * 1024; // 1MB

  if (uploadedFile.size > fileSizeLimit) {
    return res?.status(400).send('File size is too large (maximum 1MB allowed).'); // Use optional chaining to access the status property
  }

  // Move the uploaded file to your desired destination
  uploadedFile.mv('../userUploads' + uploadedFile.name, (err) => {
    if (err) {
      return res?.status(500).send(err); // Use optional chaining to access the status property
    }

    // If everything is successful, continue to the next middleware
    next();
  });
}