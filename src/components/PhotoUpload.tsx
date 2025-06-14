
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PhotoUploadProps {
  onUploadSuccess: () => void;
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
  const { user } = useAuth();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      
      // Create preview URLs
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
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

  const uploadToStorage = async (file: File, fileName: string): Promise<string> => {
    const filePath = `${user!.id}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('photos')
      .upload(filePath, file);

    if (error) {
      throw new Error(`Failed to upload ${fileName}: ${error.message}`);
    }

    return filePath;
  };

  const savePhotoToDatabase = async (file: File, filePath: string, photoTitle: string) => {
    const { error } = await supabase
      .from('photos')
      .insert({
        user_id: user!.id,
        title: photoTitle,
        description,
        category,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size
      });

    if (error) {
      throw new Error(`Failed to save photo metadata: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload photos.",
        variant: "destructive"
      });
      return;
    }

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
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const photoTitle = selectedFiles.length === 1 ? title : `${title} ${i + 1}`;
        const fileName = `${Date.now()}-${i}-${file.name}`;
        
        // Upload file to storage
        const filePath = await uploadToStorage(file, fileName);
        
        // Save metadata to database
        await savePhotoToDatabase(file, filePath, photoTitle);
      }

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
      
      onUploadSuccess();

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
                  <p className="text-xs text-gray-500 font-light">PNG, JPG or JPEG</p>
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
          {loading ? 'Uploading...' : `Upload ${selectedFiles.length || ''} Photo${selectedFiles.length !== 1 ? 's' : ''}`}
        </Button>
      </form>
    </div>
  );
};

export default PhotoUpload;
