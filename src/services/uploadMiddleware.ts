import multer from 'multer';

const storage = multer.memoryStorage();  // Usamos almacenamiento en memoria para manejar los archivos antes de enviarlos a S3
const upload = multer({ storage });

export const uploadLogo = upload.single('logo'); // Middleware para manejar la carga del archivo 'logo'
