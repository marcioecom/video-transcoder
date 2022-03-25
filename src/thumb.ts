import path from 'path';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const filePath = path.resolve(__dirname, 'assets', 'teste.mp4')

ffmpeg(filePath)
  .takeScreenshots({
    count: 1,
    timemarks: ['5'], // number of seconds
    filename: 'thumb',
  }, './src/assets/')
