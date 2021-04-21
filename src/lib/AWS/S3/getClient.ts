import * as AWS from 'aws-sdk';

const config: AWS.S3.Types.ClientConfiguration = {
  region: 'ap-southeast-1',
};

let client: AWS.S3;

export default (): AWS.S3 => {
  if (client) {
    return client;
  }

  client = new AWS.S3(config);

  return client;
};
