import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import uploadToS3 from './upload';

test('Test upload to S3', async () => {
  // const filePath = path.join(__dirname, '../../../../storage', 'dummyImage.png');
  // const fileStream = fs.createReadStream(filePath);
  // const uploadedFilename = await uploadToS3(fileStream, 'testUpload.png');
  // expect(uploadedFilename).toBeDefined();
  // https.get(`https://static.goldenrama.com/temp/${uploadedFilename}`, (res) => {
  //   expect(res.statusCode).toBe(200);
  // });
});
