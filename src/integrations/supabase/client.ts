// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sqhinevcqrybkipcnieu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxaGluZXZjcXJ5YmtpcGNuaWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NjQwNjQsImV4cCI6MjA1MDQ0MDA2NH0.UFvEEXFBxJauam2tLt2Tf5c1Y3oVfDDVZKdhbfJsI6Q";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);