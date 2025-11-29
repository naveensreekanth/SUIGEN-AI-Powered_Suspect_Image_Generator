-- Create table to track image generation requests and implement rate limiting
CREATE TABLE IF NOT EXISTS public.image_generation_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.suspect_case_records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  next_retry_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.image_generation_queue ENABLE ROW LEVEL SECURITY;

-- Users can view their own queue items
CREATE POLICY "Users can view their own queue items"
  ON public.image_generation_queue
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own queue items
CREATE POLICY "Users can insert their own queue items"
  ON public.image_generation_queue
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own queue items
CREATE POLICY "Users can update their own queue items"
  ON public.image_generation_queue
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for efficient queue processing
CREATE INDEX idx_queue_status_created ON public.image_generation_queue(status, created_at);
CREATE INDEX idx_queue_user_case ON public.image_generation_queue(user_id, case_id);

-- Function to get next available processing slot (minimum 2 seconds between requests)
CREATE OR REPLACE FUNCTION public.get_next_processing_slot()
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
AS $$
DECLARE
  last_started TIMESTAMP WITH TIME ZONE;
  next_slot TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get the most recent started request
  SELECT started_at INTO last_started
  FROM public.image_generation_queue
  WHERE status = 'processing' OR status = 'completed'
  ORDER BY started_at DESC NULLS LAST
  LIMIT 1;
  
  -- If no previous requests, can start immediately
  IF last_started IS NULL THEN
    RETURN now();
  END IF;
  
  -- Calculate next available slot (2 seconds after last request)
  next_slot := last_started + INTERVAL '2 seconds';
  
  -- If next slot is in the past, return now
  IF next_slot < now() THEN
    RETURN now();
  END IF;
  
  RETURN next_slot;
END;
$$;