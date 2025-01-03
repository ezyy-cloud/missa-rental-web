import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  onUpload: (paths: string[]) => void;
  maxFiles?: number;
  bucket?: string;
  initialImages?: string[];
}

export function ImageUpload({ 
  onUpload, 
  maxFiles = 5, 
  bucket = 'images',
  initialImages = []
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(initialImages);
  const [signedUrls, setSignedUrls] = useState<string[]>([]);

  // Get signed URLs for images
  const getSignedUrls = useCallback(async (urls: string[]) => {
    try {
      const signedUrlPromises = urls.map(async (url) => {
        const path = url.split(`/public/${bucket}/`)[1];
        if (!path) return url;

        const { data } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 60 * 60); // 1 hour expiry

        return data?.signedUrl || url;
      });

      const newSignedUrls = await Promise.all(signedUrlPromises);
      setSignedUrls(newSignedUrls);
    } catch (error) {
      console.error('Error getting signed URLs:', error);
    }
  }, [bucket]);

  // Update signed URLs when images change
  useEffect(() => {
    if (images.length > 0) {
      getSignedUrls(images);
    }
  }, [images, getSignedUrls]);

  // Set initial images once on mount
  useEffect(() => {
    if (initialImages.length > 0) {
      setImages(initialImages);
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('Starting upload for files:', acceptedFiles);
      
      const uploadPromises = acceptedFiles.map(async (file) => {
        const uniqueId = Math.random().toString(36).substring(2);
        const fileName = `${uniqueId}-${file.name}`;
        const filePath = `${fileName}`;

        console.log('Uploading file:', fileName);

        // Upload the file
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        console.log('Upload successful:', uploadData);

        // Get the public URL
        const { data: urlData } = await supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        return urlData?.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => url !== undefined);
      
      if (validUrls.length > 0) {
        setImages(validUrls);
        onUpload(validUrls);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Error uploading files. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [maxFiles, bucket, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    }
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p>Uploading...</p>
        ) : (
          <div>
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Drop the files here...'
                : `Drag 'n' drop images here, or click to select files`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Maximum {maxFiles} {maxFiles === 1 ? 'file' : 'files'}
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {images.map((url, index) => (
            <div key={url} className="relative aspect-video group">
              <img
                src={signedUrls[index] || url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const newImages = images.filter((_, i) => i !== index);
                  setImages(newImages);
                  onUpload(newImages);
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
