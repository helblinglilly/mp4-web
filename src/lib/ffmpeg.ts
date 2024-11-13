import { FFmpeg } from "@ffmpeg/ffmpeg";
import { get, writable } from "svelte/store";

export const ffmpegStore = writable<FFmpeg | undefined>(undefined);

const ffmpegLoadingState = writable<'uninitialised' | 'loading' | 'ready'>('uninitialised');


export function loadFFmpeg(){
  if (get(ffmpegLoadingState) !== 'uninitialised'){
    return;
  }

  ffmpegLoadingState.set('loading');

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
  const a = new FFmpeg();

  a.load({
    coreURL: baseURL + '/ffmpeg-core.js',
    wasmURL: baseURL + '/ffmpeg-core.wasm'
  }).then(() => {
    ffmpegStore.set(a);
    ffmpegLoadingState.set('ready');
    return a;
  }).catch((err) => {
    console.log(err);
    ffmpegLoadingState.set('uninitialised');
  })
}
