import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from 'multer'
import crypto from 'crypto'

export const upload = multer({ storage: multer.memoryStorage()})

const uploadToS3 = async(file:Express.Multer.File, category:string):Promise<string> => {
    const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
    const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY
    const awsBucketName = process.env.AWS_BUCKET_NAME
    const awsBucketRegion = process.env.AWS_BUCKET_REGION
    if(!awsAccessKeyId || !awsSecretKey || !awsBucketName || !awsBucketRegion){
        throw new Error("No AWS Credentials or Bucket details")
    }
    const s3 = new S3Client({
        region: awsBucketRegion,
        credentials: {
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsSecretKey,
        }
    });

    const randomImagename = () => crypto.randomBytes(32).toString('hex')

    const fileKey = `${category}/${randomImagename()}`
    const putObjectParams = {
        Bucket: awsBucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
    };


    try {
        const putCommand = new PutObjectCommand(putObjectParams)
        await s3.send(putCommand)

        return fileKey;
        
    } catch (error) {
        throw new Error(`Error uploading file: ${(error as Error).message}`);
    }
}

export default uploadToS3