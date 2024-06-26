import Cropper from 'react-easy-crop';

function PostCropModal({ image, crop, onCropChange, onCropComplete, onClose, onCropImage }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
      <div className="w-[40rem] h-[40rem] relative mx-auto">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <Cropper
            image={image}
            crop={crop}
            zoom={1}
            aspect={16 / 9}
            onCropChange={onCropChange}
            onCropComplete={onCropComplete}
            cropSize={{ width: 460, height: 460 }}
            cropShape="rect"
          />
          <div className="absolute top-5 right-0 m-4 z-10 mt-20">
            <button
              onClick={onClose}
              className="mr-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onCropImage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCropModal;