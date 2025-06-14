
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // TODO: Add Supabase storage and database logic here
      console.log('Upload attempt:', {
        title,
        description,
        category,
        file: selectedFile.name
      });

      // Simulate success
      toast({
        title: "Photo uploaded successfully",
        description: "Your photo has been added to your portfolio."
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('portrait');
      removeFile();
      
      onUploadSuccess();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-thin text-gray-900 mb-2">Upload Photo</h2>
        <p className="text-gray-600 font-light">Add a new photo to your portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="photo-upload" className="text-sm font-light text-gray-700">
            Photo
          </Label>
          <div className="mt-1">
            {!selectedFile ? (
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500 font-light">
                    <span className="font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 font-light">PNG, JPG or JPEG (MAX. 10MB)</p>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl!}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="title" className="text-sm font-light text-gray-700">
            Title
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
          disabled={loading || !selectedFile}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-light"
        >
          {loading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      </form>
    </div>
  );
};

export default PhotoUpload;
