-- ===================================================
-- TODOS TABLE SETUP FOR SUPABASE (Alternative with Trigger)
-- ===================================================
-- This version includes an automatic user_id trigger as backup
-- Run this SQL in your Supabase SQL Editor

-- Create todos table
CREATE TABLE public.todos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT false NOT NULL,
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_todos_user_id ON public.todos(user_id);
CREATE INDEX idx_todos_inserted_at ON public.todos(inserted_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- ===================================================
-- AUTOMATIC USER_ID TRIGGER (OPTIONAL SAFETY NET)
-- ===================================================

-- Function to automatically set user_id if not provided
CREATE OR REPLACE FUNCTION public.set_user_id()
RETURNS TRIGGER AS $$
BEGIN
    -- If user_id is null, set it to the current authenticated user
    IF NEW.user_id IS NULL THEN
        NEW.user_id := auth.uid();
    END IF;
    
    -- Ensure the user_id matches the authenticated user (security check)
    IF NEW.user_id != auth.uid() THEN
        RAISE EXCEPTION 'You can only create todos for yourself';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set user_id on insert
CREATE TRIGGER set_todos_user_id
    BEFORE INSERT ON public.todos
    FOR EACH ROW
    EXECUTE FUNCTION public.set_user_id();

-- ===================================================
-- ROW LEVEL SECURITY POLICIES
-- ===================================================

-- Users can only view their own todos
CREATE POLICY "Users can view their own todos" ON public.todos
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own todos
CREATE POLICY "Users can insert their own todos" ON public.todos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own todos
CREATE POLICY "Users can update their own todos" ON public.todos
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own todos
CREATE POLICY "Users can delete their own todos" ON public.todos
    FOR DELETE USING (auth.uid() = user_id);