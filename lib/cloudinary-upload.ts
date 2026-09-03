// lib/cloudinary-upload.ts
export async function uploadToCloudinary(
  file: File,
  uploadPreset: string,
  onProgress?: (progress: number) => void,
): Promise<{ secure_url: string; public_id: string }> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error("Cloudinary cloud name is missing");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    xhr.open("POST", url, true);

    // Track real network progress
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    xhr.send(formData);
  });
}
