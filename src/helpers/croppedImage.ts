import { Area } from 'react-easy-crop';

/**
 * Function to crop the image based on the provided crop area.
 * @param imageFile The image file to be cropped.
 * @param cropArea The area to be cropped.
 * @returns Promise that resolves with the cropped image as a base64 string.
 */
const getCroppedImg = async (imageFile: File, cropArea: Area): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = (event) => {
      const image = new Image();
      image.src = event.target?.result as string;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get 2D context for canvas'));
          return;
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = cropArea.width;
        canvas.height = cropArea.height;

        ctx.drawImage(
          image,
          cropArea.x * scaleX,
          cropArea.y * scaleY,
          cropArea.width * scaleX,
          cropArea.height * scaleY,
          0,
          0,
          cropArea.width,
          cropArea.height
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to crop image'));
              return;
            }
            console.log("blobbb",blob);
            
            console.log("croppp",URL.createObjectURL(blob));
            
            resolve(URL.createObjectURL(blob));
          },
          'image/jpeg',
          1 // quality
        );
      };
      image.onerror = (error) => {
        reject(error);
      };
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export default getCroppedImg;
