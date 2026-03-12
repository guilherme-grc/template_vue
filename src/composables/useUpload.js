import imageCompression from 'browser-image-compression';
import { ref } from 'vue';
import { useToast } from '@/composables/useToast';

export function useUpload() {
  const toast = useToast();
  const loading = ref(false);

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Compression error:', error);
      return file;
    }
  };

  const processFile = async (file) => {
    loading.value = true;
    try {
      let processedFile = file;
      if (file.type.startsWith('image/')) {
        processedFile = await compressImage(file);
      }
      
      // Simulating upload and returning a local URL for preview
      const previewUrl = URL.createObjectURL(processedFile);
      return {
        file: processedFile,
        previewUrl,
        name: file.name,
        type: file.type,
        size: processedFile.size
      };
    } catch (err) {
      toast.error('Erro no Upload', 'Não foi possível processar o arquivo.');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    processFile,
    loading
  };
}
