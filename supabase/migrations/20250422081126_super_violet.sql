/*
  # Initial Schema Setup for Campus Assistant

  1. New Tables
    - categories
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - icon (text)
      - created_at (timestamp)

    - questions
      - id (uuid, primary key)
      - text (text)
      - category_id (uuid, foreign key)
      - is_frequently_asked (boolean)
      - created_at (timestamp)

    - responses
      - id (uuid, primary key)
      - question_id (uuid, foreign key)
      - text (text)
      - is_default (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)

    - chat_sessions
      - id (uuid, primary key)
      - session_id (text, unique)
      - user_identifier (text)
      - started_at (timestamp)
      - last_active (timestamp)

    - chat_messages
      - id (uuid, primary key)
      - session_id (uuid, foreign key)
      - sender (text)
      - content (text)
      - timestamp (timestamp)
      - related_question_id (uuid, foreign key, nullable)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Create questions table
CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  is_frequently_asked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to questions"
  ON questions
  FOR SELECT
  TO public
  USING (true);

-- Create responses table
CREATE TABLE responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  text text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to responses"
  ON responses
  FOR SELECT
  TO public
  USING (true);

-- Create chat_sessions table
CREATE TABLE chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  user_identifier text,
  started_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own chat sessions"
  ON chat_sessions
  FOR ALL
  TO public
  USING (true);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('user', 'bot')),
  content text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  related_question_id uuid REFERENCES questions(id) ON DELETE SET NULL
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own chat messages"
  ON chat_messages
  FOR ALL
  TO public
  USING (true);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for responses table
CREATE TRIGGER update_responses_updated_at
  BEFORE UPDATE
  ON responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();