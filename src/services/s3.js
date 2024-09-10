import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv'

// Cargar las variables de entorno
dotenv.config()
// Crear una instancia de S3Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`, // Nombre único
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  // Enviar la solicitud de carga a S3
  const command = new PutObjectCommand(params);
  const result = await s3.send(command);
  
  // Devuelve la URL del archivo cargado
  return {
    Location: `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
  };
};
