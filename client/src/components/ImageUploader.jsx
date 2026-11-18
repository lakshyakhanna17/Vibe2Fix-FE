import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export const ImageUploader = ({
  images = [],
  onChange,
  maxFiles = 3,
  maxSizeMB = 2,
  accept = 'image/jpeg,image/png,image/webp',
}) => {
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setError(null);
    const files = Array.from(e.target.files);

    if (images.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    const validFiles = [];
    for (const file of files) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`"${file.name}" exceeds the ${maxSizeMB}MB file size limit.`);
        return;
      }
      validFiles.push(file);
    }

    onChange([...images, ...validFiles]);
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((fileOrUrl, idx) => {
          const previewUrl =
            typeof fileOrUrl === 'string'
              ? fileOrUrl
              : URL.createObjectURL(fileOrUrl);

          return (
            <div
              key={idx}
              className="relative w-20 h-20 rounded-xl overflow-hidden  bg-bg-elevated group"
            >
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-status-danger transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {images.length < maxFiles && (
          <label className="w-20 h-20 rounded-xl border-2 border-dashed  hover:border-accent hover:bg-bg-elevated/40 flex flex-col items-center justify-center cursor-pointer transition text-text-muted hover:text-white">
            <Upload className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Add photo</span>
            <input
              type="file"
              accept={accept}
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && <p className="text-xs text-status-danger">{error}</p>}
      <p className="text-[10px] text-text-muted">
        JPEG, PNG, WebP up to {maxSizeMB}MB each (max {maxFiles} images).
      </p>
    </div>
  );
};
