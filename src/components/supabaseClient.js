import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://jrjosejvnvwpzbguihpz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyam9zZWp2bnZ3cHpiZ3VpaHB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzODA3NzYsImV4cCI6MjA0NTk1Njc3Nn0.gasrDVhN2YIFBg3Oi36d1zcOGL8Aat_sHXqsB2eXxLU';

export const supabase = createClient(supabaseUrl, supabaseKey);