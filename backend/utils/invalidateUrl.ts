import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront'

const invalidateCloudFront = async(img:string) => {
    const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
    const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY
    const awsBucketRegion = process.env.AWS_BUCKET_REGION
    const awsCloudFrontDistributionId = process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID
    if(!awsAccessKeyId || !awsSecretKey || !awsCloudFrontDistributionId){
        throw new Error("No AWS Credentials or Bucket details")
    }
    const cloudFront = new CloudFrontClient({
        region:awsBucketRegion,
        credentials:{
            accessKeyId:awsAccessKeyId,
            secretAccessKey:awsSecretKey,
        }
    })

    const invalidationParams = {
        DistributionId:awsCloudFrontDistributionId,
        InvalidationBatch:{
            CallerReference:img,
            Paths:{
                Quantity:1,
                Items:[
                    "/" + img
                ]
            }
        }
    }

    const invalidationCommand = new CreateInvalidationCommand(invalidationParams);
    await cloudFront.send(invalidationCommand);
}

export default invalidateCloudFront