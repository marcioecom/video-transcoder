import path from 'path';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const filePath = path.resolve(__dirname, 'assets', 'teste.mp4')

ffmpeg(filePath)
  .output('./src/assets/screenshot-%03d.jpg')
  .outputOptions(
    '-q:v', '8',
    '-vf', 'fps=1/5,scale=-1:360',
  )
  .run()
