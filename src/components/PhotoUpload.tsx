import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface PhotoUploadProps {
  onUploadSuccess: (photos: any[]) => void;
}

const categories = [
  { id: 'portrait', name: 'Portrait' },
  { id: 'landscape', name: 'Landscape' },
  { id: 'wedding', name: 'Wedding' },
  { id: 'street', name: 'Street' },
  { id: 'nature', name: 'Nature' }
];

const PhotoUpload = ({ onUploadSuccess }: PhotoUploadProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('portrait');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        console.log(`Image dimensions: ${img.width} x ${img.height}`);
        const isValidSize = img.width <= 6000 && img.height <= 6000;
        console.log(`Is valid size: ${isValidSize}`);
        resolve(isValidSize);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        console.log('Error loading image for dimension validation');
        resolve(false);
      };
      
      img.src = url;
    });
  };

  const compressImage = (file: File, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log('Compressing image:', file.name, 'Original size:', file.size);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions to keep aspect ratio but reduce size if needed
        let { width, height } = img;
        const maxDimension = 2000; // Reduce max dimension for better compression
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        console.log('Image compressed. New size estimate:', Math.round(compressedDataUrl.length * 0.75), 'bytes');
        resolve(compressedDataUrl);
        
        URL.revokeObjectURL(img.src);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image for compression'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log('Processing file:', file.name, file.size);
      
      // Check file size (limit to 30MB)
      if (file.size > 30 * 1024 * 1024) {
        reject(new Error('File size too large. Maximum 30MB allowed.'));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('Invalid file type. Please select an image file.'));
        return;
      }

      // Use compression for better storage efficiency
      compressImage(file, 0.8)
        .then(resolve)
        .catch(reject);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      console.log(`Selected ${files.length} files for validation`);
      
      // Validate dimensions for each file
      const validFiles = [];
      const invalidFiles = [];
      
      for (const file of files) {
        console.log(`Validating file: ${file.name}`);
        const isValidDimensions = await validateImageDimensions(file);
        if (isValidDimensions) {
          validFiles.push(file);
          console.log(`✓ Valid: ${file.name}`);
        } else {
          invalidFiles.push(file.name);
          console.log(`✗ Invalid: ${file.name}`);
        }
      }
      
      if (invalidFiles.length > 0) {
        toast({
          title: "Invalid image dimensions",
          description: `The following files exceed 6000x6000 pixels: ${invalidFiles.join(', ')}`,
          variant: "destructive"
        });
      }
      
      if (validFiles.length > 0) {
        setSelectedFiles(validFiles);
        
        // Create preview URLs
        const urls = validFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
        console.log(`${validFiles.length} valid files selected`);
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const removeAllFiles = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Starting upload process...');
    console.log('Selected files:', selectedFiles.length);

    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image to upload.",
        variant: "destructive"
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your photos.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Converting and compressing files...');
      
      // Convert all files to compressed base64
      const base64Images = await Promise.all(
        selectedFiles.map(async (file, index) => {
          try {
            console.log(`Processing file ${index + 1}/${selectedFiles.length}:`, file.name);
            return await convertFileToBase64(file);
          } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
            throw error;
          }
        })
      );

      console.log('All files processed successfully');

      // Create photo objects with compressed base64 data
      const uploadedPhotos = selectedFiles.map((file, index) => ({
        id: Date.now() + index,
        title: selectedFiles.length === 1 ? title : `${title} ${index + 1}`,
        description,
        category,
        url: base64Images[index],
        fileName: file.name,
        uploadedAt: new Date().toISOString()
      }));

      console.log('Created photo objects:', uploadedPhotos.length);

      try {
        // Get existing photos from localStorage
        const existingPhotos = localStorage.getItem('uploadedPhotos');
        const allPhotos = existingPhotos ? JSON.parse(existingPhotos) : [];
        
        // Add new photos
        const updatedPhotos = [...allPhotos, ...uploadedPhotos];
        
        // Save to localStorage with error handling
        localStorage.setItem('uploadedPhotos', JSON.stringify(updatedPhotos));
        console.log('Photos saved to localStorage successfully');

        toast({
          title: "Photos uploaded successfully",
          description: `${selectedFiles.length} photo(s) have been added to your portfolio.`
        });

        // Reset form
        setTitle('');
        setDescription('');
        setCategory('portrait');
        
        // Clean up preview URLs
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setSelectedFiles([]);
        setPreviewUrls([]);
        
        console.log('Calling onUploadSuccess...');
        onUploadSuccess(uploadedPhotos);
        
        // Dispatch event to update other components
        window.dispatchEvent(new CustomEvent('photosUpdated'));
        console.log('Upload process completed successfully');

      } catch (storageError) {
        console.error('localStorage error:', storageError);
        
        // If localStorage is full, suggest compression or cleanup
        toast({
          title: "Storage limit reached",
          description: "Your browser's storage is full. Try uploading fewer photos at once or delete some existing photos.",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Upload failed",
        description: `There was an error uploading your photos: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-thin text-gray-900 mb-2">Upload Photos</h2>
        <p className="text-gray-600 font-light">Add new photos to your portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="photo-upload" className="text-sm font-light text-gray-700">
            Photos {selectedFiles.length > 0 && `(${selectedFiles.length} selected)`}
          </Label>
          <div className="mt-1">
            {selectedFiles.length === 0 ? (
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500 font-light">
                    <span className="font-medium">Click to select multiple photos</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 font-light">PNG, JPG or JPEG (MAX. 30MB each, 6000x6000 pixels)</p>
                  <p className="text-xs text-gray-500 font-light mt-1">Images will be compressed for optimal storage</p>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 font-light">
                    {selectedFiles.length} photo(s) selected
                  </p>
                  <Button
                    type="button"
                    onClick={removeAllFiles}
                    variant="outline"
                    size="sm"
                    className="font-light"
                  >
                    Remove All
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {selectedFiles[index].name}
                      </p>
                    </div>
                  ))}
                </div>
                <label
                  htmlFor="photo-upload-more"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm font-light"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add More Photos
                </label>
                <input
                  id="photo-upload-more"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="title" className="text-sm font-light text-gray-700">
            Title {selectedFiles.length > 1 && "(will be numbered automatically)"}
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1"
            placeholder="Enter photo title"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-light text-gray-700">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
            placeholder="Enter photo description"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="category" className="text-sm font-light text-gray-700">
            Category
          </Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="submit"
          disabled={loading || selectedFiles.length === 0}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-light"
        >
          {loading ? 'Processing...' : `Upload ${selectedFiles.length || ''} Photo${selectedFiles.length !== 1 ? 's' : ''}`}
        </Button>
      </form>
    </div>
  );
};

export default PhotoUpload;
