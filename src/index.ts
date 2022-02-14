import 'dotenv/config';
import transcode from './transcode';

(async (): Promise<void> => {
  const file = {
    key: "6d8f241bfa109f0e6040bc3a365c8142-video.mp4",
    bucket: "vclick-raw-videos"
  }

  const resolution = {
    suffix: '480p',
    size: '640x480'
  }

  try {
    await transcode(file, resolution)
  } catch (error: any) {
    console.log(error.message);
  }
})();
