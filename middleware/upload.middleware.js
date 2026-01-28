import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, and images are allowed.'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 30 * 1024 * 1024
  },
  fileFilter: fileFilter
});

export const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const base64Data = req.file.buffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64Data}`;
    
    req.fileData = dataUrl;
    req.fileName = req.file.originalname;
    req.fileSize = req.file.size;
    req.mimeType = req.file.mimetype;

    next();
  } catch (error) {
    next(error);
  }
};
