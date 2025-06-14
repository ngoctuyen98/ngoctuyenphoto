
-- First, let's check if RLS is enabled and what policies exist
-- Enable RLS on photos table if not already enabled
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to non-hidden photos" ON public.photos;
DROP POLICY IF EXISTS "Allow authenticated users full access to their own photos" ON public.photos;

-- Create policy for public read access to non-hidden photos
CREATE POLICY "Allow public read access to non-hidden photos" 
ON public.photos 
FOR SELECT 
USING (hidden = false OR hidden IS NULL);

-- Create policy for authenticated users to manage their own photos
CREATE POLICY "Allow authenticated users full access to their own photos" 
ON public.photos 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
