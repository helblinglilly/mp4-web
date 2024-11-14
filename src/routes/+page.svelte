<script lang="ts">
    import FileUpload from "$lib/FileUpload.svelte";
    import { fetchFile, ffmpegStore, loadFFmpeg } from "$lib/ffmpeg";
    import Icon from "$lib/Icon.svelte";
    import { getFilesize } from "$lib/filesize";
    import { FFmpeg } from "@ffmpeg/ffmpeg";

    let inputFile: File | undefined = $state(undefined);
    let output: string | undefined = $state(undefined);
    let percentage: number | undefined = $state(undefined);

    let options: { mute: boolean } = $state({ mute: false })


    export async function convert(input: File, ffmpeg: FFmpeg){
      ffmpeg.on('progress', ({ progress, time} ) => {
        percentage = progress * 100;
      })
      await ffmpeg.writeFile(input.name, await fetchFile(input));
      await ffmpeg.exec(['-i', input.name, 'output.mp4']);
      const data = await ffmpeg.readFile('output.mp4');

      console.log('done', data);


      output = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    }
</script>

<div class="h-[30vh]">
    <FileUpload
        supportedMIMETypes={['video/mp4',  'video/mpeg', 'video/mov', 'video/x-matroska', 'video/quicktime', 'video/webm', 'video/x-m4v']}
        fileselect={(file) => {
          inputFile = file;
          loadFFmpeg();
        }}
    />
</div>

<div class="h-[20vh] mt-4 grid justify-center gap-4">
    {#if inputFile}
            <Icon name="video" stroke="rgb(139 92 246 / 0.8)" />
            <div class="grid justify-center">
                <p class="text-center">{inputFile.name}</p>
                <i class="text-center">({getFilesize(inputFile.size)})</i>
            </div>
    {/if}
</div>

<div class="h-[20vh]">
    <div class="inline-flex mb-4 w-full justify-center">
        <input type="checkbox" value={options.mute} id="mute" />
        <label for="mute" class="text-lg">Remove audio</label>
    </div>

    <div class="w-full flex">
        <button
            class={`rounded-lg py-4 w-full md:w-[28rem] mx-auto ${inputFile === undefined || $ffmpegStore === undefined ? 'bg-violet-800/40' : 'bg-violet-800'}`}
            disabled={inputFile === undefined || $ffmpegStore === undefined}
            onclick={() => {
              if (inputFile === undefined || $ffmpegStore === undefined){
                console.log('not ready yet');
                return;
              }
              convert(inputFile, $ffmpegStore);
            }}
        >
            {inputFile ? $ffmpegStore === undefined ? 'Loading' : 'Convert' : 'Select file to get started'}
        </button>

    </div>

    <div class="grid">
        {#if percentage}
            <progress max={100} value={percentage} >
                {percentage.toString().slice(0, 5)}%
            </progress>
        {/if}
        {#if output}
            <a href={output}>Download</a>
        {/if}
    </div>
</div>
