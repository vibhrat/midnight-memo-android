
-- Create tables for storing app data
CREATE TABLE public.casual_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  tag TEXT DEFAULT '',
  content TEXT DEFAULT '',
  is_blurred BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.shopping_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.shopping_list_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shopping_list_id UUID REFERENCES public.shopping_lists ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  quantity TEXT DEFAULT '1',
  checked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.passwords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  password TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.password_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_id UUID REFERENCES public.passwords ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  password TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.casual_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_fields ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for casual_notes
CREATE POLICY "Users can view their own notes" ON public.casual_notes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own notes" ON public.casual_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON public.casual_notes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON public.casual_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for shopping_lists
CREATE POLICY "Users can view their own lists" ON public.shopping_lists
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own lists" ON public.shopping_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lists" ON public.shopping_lists
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own lists" ON public.shopping_lists
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for shopping_list_items
CREATE POLICY "Users can view items in their own lists" ON public.shopping_list_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      WHERE id = shopping_list_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create items in their own lists" ON public.shopping_list_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      WHERE id = shopping_list_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update items in their own lists" ON public.shopping_list_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      WHERE id = shopping_list_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete items in their own lists" ON public.shopping_list_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      WHERE id = shopping_list_id AND user_id = auth.uid()
    )
  );

-- Create RLS policies for passwords
CREATE POLICY "Users can view their own passwords" ON public.passwords
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own passwords" ON public.passwords
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own passwords" ON public.passwords
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own passwords" ON public.passwords
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for password_fields
CREATE POLICY "Users can view fields in their own passwords" ON public.password_fields
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.passwords 
      WHERE id = password_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create fields in their own passwords" ON public.password_fields
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.passwords 
      WHERE id = password_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update fields in their own passwords" ON public.password_fields
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.passwords 
      WHERE id = password_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete fields in their own passwords" ON public.password_fields
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.passwords 
      WHERE id = password_id AND user_id = auth.uid()
    )
  );
