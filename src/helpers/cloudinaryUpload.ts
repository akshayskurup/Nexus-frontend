export const uploadImageToCloudinary = async (croppedImageBase64: string) => {
    const blob = await fetch(croppedImageBase64).then(res => res.blob());
    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'esvik6y6'); 
    formData.append('cloud_name', 'dsirnl1mh'); 
  
    const res = await fetch("https://api.cloudinary.com/v1_1/dsirnl1mh/image/upload", {
      method: 'POST',
      body: formData
    });
  
    const data = await res.json();
    console.log(data.secure_url);
    return data.secure_url;
  };