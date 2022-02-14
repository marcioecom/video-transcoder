import AWS from 'aws-sdk';
// import { PassThrough } from 'stream';
import { createWriteStream } from 'fs';
import path from 'path';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

interface IFile {
  key: string;
  bucket: string;
}

interface IResolution {
  suffix: string; // 720p
  size: string;   // 1280x720
}

export default async function transcode(
  file: IFile,
  resolution: IResolution,
) {
  const s3Client = new AWS.S3({
    region: 'us-east-2',
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  })

  const params = {
    Bucket: file.bucket,
    Key: file.key,
  }

  const originStream = s3Client.getObject(params).createReadStream();

  const destinationFile = file.key.replace(
    '.mp4',
    `_${resolution.suffix}.mp4`
  )
  const stream = createWriteStream(
    path.resolve(__dirname, 'tmp', destinationFile)
  );

  // function uploadFromStream() {
  //   const passThrough = new PassThrough();

  //   const destinationStream = {
  //     Bucket: 'vclick-hls-videos',
  //     Key: destinationFile,
  //     Body: passThrough,
  //   };

  //   s3Client.upload(destinationStream);

  //   return passThrough;
  // }

  ffmpeg(originStream)
    .withOutputOption('-f mp4')
    .withOutputOption('-preset superfast')
    .withOutputOption('-movflags frag_keyframe+empty_moov')
    .withOutputOption('-max_muxing_queue_size 9999')
    .withVideoCodec('libx264')
    .withSize(resolution.size) // 640x480
    .withAspectRatio('16:9')
    .on('start', cmdLine => {
      console.log(`[${resolution.suffix}] Started FFMpeg`, cmdLine);
    })
    .on('end', () => {
      console.log(`[${resolution.suffix}] Sucess!.`);

      return process.exit(0);
    })
    .on('error', (err: Error, stdout, stderr) => {
      console.log(`[${resolution.suffix}] Error:`, err.message);
      console.error('stdout:', stdout);
      console.error('stderr:', stderr);

      throw new Error(err.message)
    })
    .pipe(stream, { end: true })
  // .pipe(uploadFromStream(), { end: true });
}