/**
 * Local Storage Service for Development
 * Connects to the custom Vite Plugin at /api/local-upload
 */

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]); // Get just base64 string
  reader.onerror = error => reject(error);
});

export const storageService = {
  /**
   * Upload both files to the local Vite Dev Server API
   */
  async localUpload(modelName, teamNumber, categories, features, thumbFile, stepFile, glbFile, onProgress) {
    if (onProgress) onProgress(20);
    
    // Convert files to base64
    let stepFileData = null;
    let glbFileData = null;
    let thumbFileData = null;

    if (stepFile) {
      if (onProgress) onProgress(40);
      stepFileData = {
        name: stepFile.name,
        content: await fileToBase64(stepFile)
      };
    }

    if (glbFile) {
      if (onProgress) onProgress(60);
      glbFileData = {
        name: glbFile.name,
        content: await fileToBase64(glbFile)
      };
    }

    if (thumbFile) {
      if (onProgress) onProgress(70);
      thumbFileData = {
        name: thumbFile.name,
        content: await fileToBase64(thumbFile)
      };
    }

    const payload = {
      name: modelName,
      teamNumber,
      categories,
      features,
      thumbFile: thumbFileData,
      stepFile: stepFileData,
      glbFile: glbFileData
    };

    if (onProgress) onProgress(80);

    const response = await fetch('/api/local-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to upload files locally');
    }

    if (onProgress) onProgress(100);

    return await response.json();
  }
};
