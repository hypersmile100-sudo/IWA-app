// js/supabase-client.js - CORRECTED AND FINAL VERSION

// IMPORTANT: MAKE SURE THESE ARE YOUR REAL SUPABASE URL AND KEY
const SUPABASE_URL = 'https://ospwbnnviqwayjdweebp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zcHdibm52aXF3YXlqZHdlZWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDY3NTMsImV4cCI6MjA3MjcyMjc1M30.pQvl9qnY1NVEfPjbn2VtZTDKHVhXOA4cIA_1diVqX5U';

// This is the correct and safe way to initialize the client.
// It uses the global 'supabase' object provided by the CDN script.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);