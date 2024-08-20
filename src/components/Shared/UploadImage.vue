<template>
  <div class="drop">
    <slot name="drop-title"></slot>
    <p v-if="error && !isMobile" class="drop-error">{{ error }}</p>

    <div
      :class="[
        'drop-area',
        { 'drop-area--danger': error },
        { 'drop-area--has-image': image },
      ]"
      @dragover.prevent.stop="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <p v-if="!image" class="drop-area-text">
        <span>Перетащите фото сюда</span>
        <label class="file-upload-link" for="fileInput">{{
          "Или загрузите файл"
        }}</label>
      </p>
      <div v-else class="drop-area-image">
        <img
          :src="image"
          alt="Dropped Image"
          class="dropped-image"
          @click="showFullImage"
        />
        <label class="file-upload-link" for="fileInput">{{
          "Изменить фото"
        }}</label>
      </div>
      <input
        type="file"
        ref="fileInput"
        id="fileInput"
        accept="image/*,.heic,.heif"
        style="display: none"
        @change="handleFileInput"
      />
    </div>
    <p v-if="error && isMobile" class="drop-error">{{ error }}</p>
    <div v-if="isMobile">
      <button @click="openCamera" class="make-photo-btn">
        {{ "сделать фото" }}
      </button>
      <input
        type="file"
        accept="image/*,.heic,.heif"
        capture="environment"
        ref="fileInputMobile"
        style="display: none"
        @change="handleFileChange"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import FullImageDialog from "./FullImageDialog.vue";
import { useQuasar } from "quasar";
import Compressor from "compressorjs";
import isHEIC from "../../helpers/isHeicFile";
import heic2any from "heic2any";

export default {
  props: {
    value: String,
  },
  emits: ["image-uploaded"],
  data() {
    return {
      error: null,
      isMobile: null,
      image: this.value,
    };
  },

  setup(props, { expose }) {
    const $q = useQuasar();
    const imageFromSetup = ref(props.value);
    const showFullImage = () => {
      $q.dialog({
        component: FullImageDialog,
        componentProps: {
          imageSrc: imageFromSetup.value,
        },
      });
    };

    return { showFullImage, imageFromSetup };
  },
  methods: {
    async processImageFile(file) {
      this.error = null;

      if (file && (file.type.startsWith("image/") || isHEIC(file))) {
        let jpegFile = file;

        if (isHEIC(file)) {
          const jpegBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
          });

          jpegFile = new File([jpegBlob], `${file.name.split(".")[0]}.jpg`, {
            type: "image/jpeg",
          });
        }

        const reader = new FileReader();

        reader.onload = () => {
          this.image = reader.result;
          this.imageFromSetup = reader.result;

          new Compressor(jpegFile, {
            quality: 0.4,
            success: (result) => {
              this.$emit("image-upladed", {
                file: result,
                readerPhoto: reader.result,
              });
            },
          });
        };

        reader.readAsDataURL(jpegFile);
      } else {
        this.error = this.$t("upload-image-upload-photo");
        console.error("Неверный тип файла. Пожалуйста, загрузите изображение.");
      }
    },

    handleDragOver(event) {
      event.preventDefault();
      event.target.classList.add("drag-over");
    },
    handleDragLeave(event) {
      event.target.classList.remove("drag-over");
    },
    handleDrop(event) {
      event.preventDefault();
      event.target.classList.remove("drag-over");
      const file = event.dataTransfer.files[0];
      this.processImageFile(file);
    },
    async handleFileInput() {
      const fileInput = this.$refs.fileInput;
      const file = fileInput.files[0];
      this.processImageFile(file);
      fileInput.value = null;
    },

    openCamera() {
      this.$refs.fileInputMobile.click();
    },
    handleFileChange(event) {
      this.error = null;
      const fileInput = this.$refs.fileInputMobile;
      const file = fileInput.files[0];
      this.processImageFile(file);
      fileInput.value = null;
    },
  },
  mounted() {
    this.isMobile = window.matchMedia(
      "only screen and (max-width: 768px)"
    ).matches;
  },
};
</script>

<style scoped>
.drop {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
}

.drop-area {
  border-radius: 12px;
  border: 2px dashed var(--color-light-gray-500, #d0d8e5);
  padding: 32px 0;
  display: flex;
  justify-content: center;
}
.drop-area--has-image {
  padding: 16px 0;
}
.drop-area--uploaded {
  padding: 16px 0;
}
.drop-area-text {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 8px;
  margin-bottom: 0;
}
.drop-area-image {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}
.drag-over {
  border-color: var(--color-blue);
}
.drop-area--danger {
  border-color: var(--color-red);
}
.drop-area-text span {
  color: #404f6f;
  font-size: 15px;
}
.file-upload-link {
  color: #219e9f;
  cursor: pointer;
  font-size: 15px;
}
.dropped-image {
  width: 117px;
  aspect-ratio: 16/9;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
}
.make-photo-btn {
  padding: 12px 32px;
  display: flex;
  width: 100%;
  justify-content: center;
  border: none;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  border-radius: var(--radius-3, 16px);
  background: var(--color-light-gray-400, #e3e8f0);
}
.drop-error {
  font-size: 15px;
  margin: 0;
  color: var(--color-red);
}
</style>
