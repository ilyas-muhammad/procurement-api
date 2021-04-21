import { AWSError, Request } from 'aws-sdk';
import { DeleteObjectTaggingOutput } from 'aws-sdk/clients/s3';
import { PromiseResult } from 'aws-sdk/lib/request';
import getClient from './getClient';

export default async (
  sourceKey: string,
  destinationKey: string,
): Promise<PromiseResult<DeleteObjectTaggingOutput, AWSError>> => {
  const client = getClient();
  const bucket = 'static.goldenrama.com';

  return client
    .copyObject({
      Bucket: bucket,
      CopySource: sourceKey,
      Key: destinationKey,
      ACL: 'public-read',
    })
    .promise();
};
