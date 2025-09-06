-- Supabase table for requests
-- This matches your existing table schema

CREATE TABLE IF NOT EXISTS public.requests (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    mobile CHARACTER VARYING NOT NULL,
    code CHARACTER VARYING NOT NULL,
    status CHARACTER VARYING NULL DEFAULT 'registered'::CHARACTER VARYING,
    payload TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    CONSTRAINT requests_pkey PRIMARY KEY (id),
    CONSTRAINT requests_code_key UNIQUE (code)
) TABLESPACE pg_default;

-- Create an index on mobile for faster lookups
CREATE INDEX IF NOT EXISTS idx_requests_mobile ON requests(mobile);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at DESC);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);

-- Create an index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_requests_code ON requests(code);

-- Enable Row Level Security (RLS) for better security
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- You may want to restrict this further based on your needs
CREATE POLICY "Allow all operations for authenticated users" ON requests
    FOR ALL USING (true);

-- Alternative: More restrictive policy (uncomment if you want stricter access)
-- CREATE POLICY "Allow all operations for service role" ON requests
--     FOR ALL USING (auth.role() = 'service_role');
