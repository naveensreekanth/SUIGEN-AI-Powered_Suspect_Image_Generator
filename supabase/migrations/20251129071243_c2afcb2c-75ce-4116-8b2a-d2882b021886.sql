-- Fix security warning: Set search_path for function
DROP FUNCTION IF EXISTS public.get_next_processing_slot();

CREATE OR REPLACE FUNCTION public.get_next_processing_slot()
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
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