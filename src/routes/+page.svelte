<script lang="ts">
    import FileUpload from "$lib/FileUpload.svelte";
    import { ffmpegStore, loadFFmpeg } from "$lib/ffmpeg";

    let inputFile: File | undefined = $state(undefined);

    let options: { mute: boolean } = $state({ mute: false })
</script>

<div class="h-[35vh]">
    <FileUpload
        supportedMIMETypes={['video/mp4',  'video/mpeg', 'video/mov', 'video/x-matroska', 'video/quicktime', 'video/webm', 'video/x-m4v']}
        fileselect={(file) => {
          inputFile = file;
          loadFFmpeg();
        }}
    />
</div>

<div class="inline-flex">
    <input type="checkbox" value={options.mute} id="mute" class="bg-violet-500/80" />
    <label for="mute" class="text-lg">Remove audio</label>
</div>

{#if inputFile}
    <p>{inputFile.name}</p>
{/if}

<button>{ffmpegStore === undefined ? 'Loading' : 'Ready'}</button>
