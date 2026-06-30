const { createClient } = require("@supabase/supabase-js");

// 🔥 این 2 تا را از Supabase بردار
const supabaseUrl = "PASTE_PROJECT_URL_HERE";
const supabaseKey = "PASTE_ANON_KEY_HERE";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;