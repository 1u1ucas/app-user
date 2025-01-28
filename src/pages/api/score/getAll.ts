import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    try {
      // Requête vers Supabase pour récupérer les scores
      const { data, error } = await supabase
        .from('score')
        .select('*')

      if (error) {
        return res.status(404).json({ error: 'score de l\'utilisateur introuvable.' + error });
      }

      return res.status(200).json(data); // Retourne l'utilisateur trouvé

    }
    catch (error) {
      return res.status(500).json({ error: 'Erreur serveur.' + error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}