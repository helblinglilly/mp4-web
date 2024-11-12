<script lang="ts">
  let files = []; // Store the selected files
  let isDragOver = false; // Track drag-over state

  let fileInput: HTMLInputElement;

  // Handle files when dropped or selected via file input
  function handleFiles(selectedFiles) {
    files = Array.from(selectedFiles);
    alert(`${files.length} file(s) selected.`);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="upload-area w-full h-full rounded-md flex items-center align-center justify-center border-dashed border-2 border-cyan-300 {isDragOver ? 'dragover' : ''}"
  on:click={() => fileInput.click() }
  on:dragover={(e) => {
    e.preventDefault();
    isDragOver = true;
  }}
  on:dragleave={(e) => {
    e.preventDefault();
    isDragOver = false;
  }}
  on:drop={(e) => {
    e.preventDefault();
    isDragOver = false;
    handleFiles(e.dataTransfer.files);
  }}
>
  Drag & drop files here or click to upload
  <input type="file"
      class="hidden"
      on:change={(e) => handleFiles(e.target.files)}
      bind:this={fileInput}>
      multiple
</div>

{#if files.length > 0}
  <p>{files.length} file(s) selected:</p>
  <ul>
    {#each files as file}
      <li>{file.name}</li>
    {/each}
  </ul>
{/if}


<style>
  .upload-area {
    /* border: 2px dashed #007bff; */
    font-size: 16px;
    color: #007bff;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  /* Highlight when dragging files over the area */
  .dragover {
    background-color: #e3f2fd;
  }
</style>
