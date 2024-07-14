import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const getCloudFrontSignedUrl = (fileKey:string, time:number):string=> {

    const privateKey = process.env.AWS_CLOUDFRONT_PRIVATE_KEY
    const keyPairId = process.env.AWS_CLOUDFRONT_KEY_PAIR_ID
    const domainName = process.env.AWS_CLOUDFRONT_DOMAIN_NAME

    if(!privateKey || !keyPairId || !domainName) throw new Error("No CloudFront private key or key pair Id")

    const date = new Date();
    date.setHours(date.getHours() + time); // Set expiration to 15 days from now
    const dateLessThan = date.toISOString();
    return getSignedUrl({
        url:`${domainName}/${fileKey}`,
        dateLessThan:dateLessThan,
        privateKey:privateKey,
        keyPairId:keyPairId,
    })
    
}

export default getCloudFrontSignedUrl
