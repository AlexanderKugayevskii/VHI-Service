<template>
  <div
    class="drop-area"
    :class="{ 'drop-area--active': activeArea }"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <div v-if="!imageSrc" class="drop-area-descriprion">
      <p>Перетащите фото сюда или</p>

      <span @click="triggerFileInput">загрузите файл</span>
      <input type="file" ref="fileInput" @change="handleFileChosen" hidden />
    </div>
    <div v-else>
      <img :src="imageSrc" alt="Preview" @click="openFullImage" />
      <button @click="removeImage">Удалить фото</button>
    </div>
  </div>
  <div v-if="loading">
    Загрузка: <progress :value="progress" max="100"></progress>
    <button @click="cancelUpload">Отменить загрузку</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const loading = ref(false);
const progress = ref(0);
const imageSrc = ref(null);
const fileInput = ref(null);
const activeArea = ref(false);
let cancelTokenSource = axios.CancelToken.source();

function handleDragOver(event) {
  // Здесь можно добавить стилизацию для области перетаскивания
  activeArea.value = true;
}
function handleDragLeave(event) {
  activeArea.value = false;
}

async function handleDrop(event) {
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    uploadImage(file);
  }
}

function handleFileChosen(event) {
  const files = event.target.files;
  if (files.length > 0) {
    const file = files[0];
    uploadImage(file);
  }
}

function triggerFileInput() {
  fileInput.value.click();
}

async function uploadImage(file) {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  loading.value = true;

  try {
    const response = await axios.post("/upload", formData, {
      onUploadProgress: (progressEvent) => {
        const totalLength = progressEvent.lengthComputable
          ? progressEvent.total
          : progressEvent.target.getResponseHeader("content-length") ||
            progressEvent.target.getResponseHeader(
              "x-decompressed-content-length"
            );
        if (totalLength !== null) {
          progress.value = Math.round(
            (progressEvent.loaded * 100) / totalLength
          );
        }
      },
      cancelToken: cancelTokenSource.token,
    });

    imageSrc.value = URL.createObjectURL(file);
  } catch (error) {
    console.error("Upload cancelled or network error:", error);
  } finally {
    loading.value = false;
  }
}

function cancelUpload() {
  if (cancelTokenSource) {
    cancelTokenSource.cancel("Operation cancelled by the user.");
  }
}

function removeImage() {
  imageSrc.value = null;
  progress.value = 0;
}

function openFullImage() {
  if (imageSrc.value) {
    window.open(imageSrc.value, "_blank");
  }
}
</script>

<style>
.drop-area {
  border: 2px dashed #d0d8e5;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  min-height: 108px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 
  &--active {
    border: 1px dashed #219e9f;
  } */
  transition: border 0.3s;
}
.drop-area--active {
  border: 1px dashed #13b8ba;
}
.drop-area img {
  max-width: 100%;
  max-height: 200px;
  margin-top: 10px;
}
.drop-area-descriprion {
  p {
    margin: 0;
    margin-bottom: 4px;
  }
  span {
    color: #219e9f;
    font-size: 15px;
    line-height: 20px;
  }
}
</style>
