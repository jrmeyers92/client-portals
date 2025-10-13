const IMAGE_CONFIGS = {
  logo: { width: 300, height: 300, quality: 0.9, keepAspectRatio: true },
  banner: { width: 1920, height: 800, quality: 0.85, keepAspectRatio: false },
  gallery: { width: 800, height: 600, quality: 0.8, keepAspectRatio: false },
  thumbnail: { width: 200, height: 200, quality: 0.75, keepAspectRatio: false },
  card: { width: 400, height: 300, quality: 0.8, keepAspectRatio: false },
};

export const resizeImage = (
  file: File,
  type: keyof typeof IMAGE_CONFIGS
): Promise<File> => {
  const config = IMAGE_CONFIGS[type];

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    img.onload = () => {
      let { width, height } = img;
      const {
        width: maxWidth,
        height: maxHeight,
        keepAspectRatio,
        quality,
      } = config;

      if (keepAspectRatio) {
        // Maintain aspect ratio (good for logos)
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        if (ratio < 1) {
          // Only resize if image is larger than target
          width *= ratio;
          height *= ratio;
        }
      } else {
        // Fit within bounds while maintaining aspect ratio
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        if (ratio < 1) {
          // Only resize if image is larger than target
          width *= ratio;
          height *= ratio;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image with high quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to create blob"));
            return;
          }

          // Create a new File object with updated extension for WebP
          const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
          const resizedFile = new File([blob], `${fileNameWithoutExt}.webp`, {
            type: "image/webp",
            lastModified: Date.now(),
          });

          resolve(resizedFile);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = URL.createObjectURL(file);
  });
};

// Generate multiple sizes for responsive images
export const generateResponsiveSizes = async (
  file: File,
  sizes: number[] = [200, 400, 800, 1200]
): Promise<{ [size: number]: File }> => {
  const results: { [size: number]: File } = {};

  for (const size of sizes) {
    try {
      const resizedFile = await resizeImageToWidth(file, size);
      results[size] = resizedFile;
    } catch (error) {
      console.warn(`Failed to resize to ${size}px:`, error);
    }
  }

  return results;
};

// Resize image to specific width while maintaining aspect ratio
export const resizeImageToWidth = (
  file: File,
  targetWidth: number,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    img.onload = () => {
      const ratio = targetWidth / img.width;
      const width = targetWidth;
      const height = img.height * ratio;

      canvas.width = width;
      canvas.height = height;

      // High quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to create blob"));
            return;
          }

          const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
          const resizedFile = new File(
            [blob],
            `${fileNameWithoutExt}_${width}w.webp`,
            {
              type: "image/webp",
              lastModified: Date.now(),
            }
          );

          resolve(resizedFile);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

// Create blur placeholder from image
export const createBlurPlaceholder = (
  file: File,
  width: number = 20,
  height: number = 20
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;

      // Disable smoothing for pixelated blur effect
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to data URL
      const dataURL = canvas.toDataURL("image/jpeg", 0.1);
      resolve(dataURL);
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

// Optimize image format based on browser support
export const optimizeImageFormat = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    // Check format support
    const supportsWebP =
      canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
    const supportsAVIF =
      canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0;

    let format = "image/jpeg";
    let extension = "jpg";
    let quality = 0.8;

    if (supportsAVIF) {
      format = "image/avif";
      extension = "avif";
      quality = 0.7; // AVIF can use lower quality for same visual quality
    } else if (supportsWebP) {
      format = "image/webp";
      extension = "webp";
      quality = 0.8;
    }

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to create optimized blob"));
            return;
          }

          const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
          const optimizedFile = new File(
            [blob],
            `${fileNameWithoutExt}.${extension}`,
            {
              type: format,
              lastModified: Date.now(),
            }
          );

          resolve(optimizedFile);
        },
        format,
        quality
      );
    };

    img.onerror = () =>
      reject(new Error("Failed to load image for optimization"));
    img.src = URL.createObjectURL(file);
  });
};

// Get image dimensions without loading full image
export const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  });
};
