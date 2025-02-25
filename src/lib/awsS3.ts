import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadLogoToS3 = async (logoFile: File): Promise<string | null> => {
    // Crear un buffer para el archivo
    const buffer = await logoFile.arrayBuffer();
    
    const params = {
      Bucket: 'inx-event-marte-bucket',
      Key: `logos/${Date.now()}-${logoFile.name}`, // Asegúrate de que el nombre del archivo sea único
      Body: Buffer.from(buffer), // Convierte el arrayBuffer a un buffer
      ContentType: logoFile.type,
      ACL: 'public-read',
    };
  
    try {
      const s3Response = await s3.upload(params).promise();
      return s3Response.Location; // Devuelve la URL del archivo cargado
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('Error uploading logo to S3');
    }
  };
  
