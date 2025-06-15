
CREATE OR REPLACE FUNCTION public.update_lessons_order(p_lesson_ids uuid[])
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function will be called from an admin-only page.
  -- The RLS policy on the `lessons` table already ensures that only admins can perform updates.
  
  -- Update the order for each lesson ID passed in the array
  FOR i IN 1..array_length(p_lesson_ids, 1) LOOP
    UPDATE public.lessons
    SET "order" = i - 1 -- Using a 0-based index for ordering
    WHERE id = p_lesson_ids[i];
  END LOOP;
END;
$$;
