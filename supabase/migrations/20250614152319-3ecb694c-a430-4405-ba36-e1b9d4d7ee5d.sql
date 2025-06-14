
-- Create storage bucket for photo files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true);

-- Create photos table for metadata
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  featured BOOLEAN DEFAULT false,
  hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for photos
CREATE POLICY "Users can view their own photos" 
  ON public.photos 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own photos" 
  ON public.photos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos" 
  ON public.photos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" 
  ON public.photos 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage policies for the photos bucket
CREATE POLICY "Anyone can view photos" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own photos in storage" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own photos from storage" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
