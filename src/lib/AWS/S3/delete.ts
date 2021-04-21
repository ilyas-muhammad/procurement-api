import { AWSError, Request } from 'aws-sdk';
import { DeleteObjectTaggingOutput } from 'aws-sdk/clients/s3';
import { PromiseResult } from 'aws-sdk/lib/request';
import getClient from './getClient';

export default async (key: string): Promise<PromiseResult<DeleteObjectTaggingOutput, AWSError>> => {
  const client = getClient();
  const bucket = 'static.goldenrama.com';

  return client
    .deleteObject({
      Bucket: bucket,
      Key: key,
    })
    .promise();
};
