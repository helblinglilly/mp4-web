<script lang="ts">
  import FileUpload from "$lib/FileUpload.svelte";
  import { fetchFile, ffmpegStore, loadFFmpeg } from "$lib/ffmpeg";
  import Icon from "$lib/Icon.svelte";
  import { getFilesize } from "$lib/filesize";
  import { FFmpeg } from "@ffmpeg/ffmpeg";

  let inputFile: File | undefined = $state(undefined);
  let output: string | undefined = $state(undefined);
  let percentage: number | undefined = $state(undefined);
  let downloadButton: HTMLAnchorElement;
  let isTranscoding = $state(false);

  let options: { mute: boolean } = $state({ mute: false });

  let isButtonEnabled = $state(false);
  let buttonText = $state("Select file to get started");

  export async function convert(input: File, ffmpeg: FFmpeg) {
    isButtonEnabled = false;
    buttonText = "Transcoding...";

    await ffmpeg.writeFile(input.name, await fetchFile(input));
    ffmpeg.on("progress", ({ progress }) => {
      percentage = progress * 100;
    });

    try {
      // `${options.mute ? '-an' : '-acodec aac'}` '-vcodec h264'
      await ffmpeg.exec([`-i`, input.name, `${input.name}.mp4`]);
      const data = await ffmpeg.readFile(`${input.name}.mp4`);

      // @ts-expect-error buffer does exist
      output = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
      isTranscoding = false;
      isButtonEnabled = true;
      buttonText = "Download";
    } catch {
      isButtonEnabled = false;
      buttonText = "Something went wrong";
    }
  }
</script>

<div class="h-[30vh]">
  <FileUpload
    supportedMIMETypes={[
      "video/mp4",
      "video/mpeg",
      "video/mov",
      "video/x-matroska",
      "video/quicktime",
      "video/webm",
      "video/x-m4v",
    ]}
    fileselect={(file) => {
      isButtonEnabled = false;
      buttonText = "Loading";

      inputFile = file;
      loadFFmpeg();

      isButtonEnabled = true;
      buttonText = "Convert";
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
      class={`rounded-lg py-4 w-full md:w-[28rem] mx-auto ${isButtonEnabled ? "bg-violet-800" : "bg-violet-800/40"}`}
      disabled={!isButtonEnabled}
      onclick={() => {
        if (!isButtonEnabled || !inputFile || !$ffmpegStore) {
          return;
        }

        if (output) {
          downloadButton.click();
        } else {
          convert(inputFile, $ffmpegStore);
          isTranscoding = true;
        }
      }}
    >
      {buttonText}
    </button>
    <a href={output} download class="hidden" bind:this={downloadButton}>a</a>
  </div>

  <div class="pt-4 w-full flex justify-center">
    {#if isTranscoding}
      <progress max={100} value={percentage ?? 0} class="w-full md:w-[28rem]">
        {(percentage ?? 0).toString().slice(0, 5)}%
      </progress>
    {/if}
  </div>
</div>
