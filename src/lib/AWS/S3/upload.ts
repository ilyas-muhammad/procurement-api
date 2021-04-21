import { PutObjectRequest } from 'aws-sdk/clients/s3';
import * as uuid from 'uuid/v1';
import getClient from './getClient';

export default async (file: PutObjectRequest['Body'], filename: string): Promise<string> => {
  const client = getClient();
  const uniqueId = uuid();
  const tempFilename = `${uniqueId}-${filename}`;

  await client
    .upload({
      Bucket: 'static.goldenrama.com',
      Key: `temp/${tempFilename}`,
      Body: file,
      ACL: 'public-read',
    })
    .promise();

  return tempFilename;
};
