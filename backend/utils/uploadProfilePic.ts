import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import multer from 'multer'
import crypto from 'crypto'

export const upload = multer({ storage: multer.memoryStorage()})

const uploadProfilePic = async(file:Express.Multer.File):Promise<string> => {
    const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
    const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY
    const awsBucketName = process.env.AWS_BUCKET_NAME
    const awsBucketRegion = process.env.AWS_BUCKET_REGION
    if(!awsAccessKeyId || !awsSecretKey || !awsBucketName || !awsBucketRegion){
        throw new Error("No AWS Credentials")
    }
    const s3 = new S3Client({
        region: awsBucketRegion,
        credentials: {
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsSecretKey,
        }
    });

    const randomImagename = () => crypto.randomBytes(32).toString('hex')

    const fileKey = `profile-pics/${randomImagename()}`
    const putObjectParams = {
        Bucket: awsBucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
    };


    try {
        const putCommand = new PutObjectCommand(putObjectParams)
        await s3.send(putCommand)

        const date = new Date();
        date.setDate(date.getDate() + 15); // Set expiration to 15 days from now
        const dateLessThan = date.toISOString();

        return getSignedUrl({
            url:`https://d1p3rpbw5imkqs.cloudfront.net/${fileKey}`,
            dateLessThan:dateLessThan,
            privateKey:process.env.AWS_CLOUDFRONT_PRIVATE_KEY || "",
            keyPairId:process.env.AWS_CLOUDFRONT_KEY_PAIR_ID || "",
        })
        
    } catch (error) {
        throw new Error(`Error uploading file: ${(error as Error).message}`);
    }
}

export default uploadProfilePic