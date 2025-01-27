import { createClient } from '@supabase/supabase-js';


// Récupère les variables d'environnement
const supabaseUrl = 'https://hpjstdrieovdnwvxuaxa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwanN0ZHJpZW92ZG53dnh1YXhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzk4MTQ1MSwiZXhwIjoyMDUzNTU3NDUxfQ.WW8V-p37LPTsgRFdvY1rnMKCQcF38pe7YQMQNHgaZbs'

// Validation des variables d'environnement
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Les variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY ne sont pas définies dans votre fichier .env.local'
  );
}

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
