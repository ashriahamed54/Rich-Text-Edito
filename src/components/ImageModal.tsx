
import React, { useState, useRef } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageData: { src: string; alt: string }) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, onInsert }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [altText, setAltText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsert = () => {
    if (imagePreview) {
      onInsert({
        src: imagePreview,
        alt: altText || 'Inserted image'
      });
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview('');
    setAltText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Insert Image</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Choose Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {imagePreview && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">Preview</label>
            <img src={imagePreview} alt="Preview" className="max-w-full h-32 object-contain border border-gray-200 rounded" />
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">Alt Text (optional)</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe the image..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!imagePreview}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
