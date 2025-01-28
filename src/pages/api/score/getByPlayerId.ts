import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    const { playerId } = req.body; // Récupère le user_id à partir des paramètres de la requête

    if (!playerId) {
      return res.status(400).json({ error: 'Le user_id est obligatoire' });
    }

    try {
      // Requête vers Supabase pour récupérer les scores de l'utilisateur
      const { data, error } = await supabase
        .from('score')
        .select('*')
        .eq('playerId', playerId) // Filtre les scores par user_id

      if (error) {
        return res.status(404).json({ error: 'Scores de l\'utilisateur introuvables.' + error });
      }

      return res.status(200).json(data); // Retourne les scores de l'utilisateur

    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur.' + error });
    }
  }

  return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
}
