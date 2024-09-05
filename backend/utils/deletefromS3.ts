import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const deleteFromS3 = async(img:string) => {
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

    
    const deleteObjectParams = {
        Bucket:awsBucketName,
        Key:img
    }

    try {
        const deleteCommand = new DeleteObjectCommand(deleteObjectParams);
        await s3.send(deleteCommand);
    } catch (error) {
        throw new Error(`Error deleting file: ${(error as Error).message}`);
    }
}

export default deleteFromS3