import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Récupère le paramètre de l'URL (peut être `id` ou `player_id`)

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Un identifiant (id ou player_id) est requis.' });
  }

  if (req.method === 'GET') {
    try {
      // Requête vers Supabase pour récupérer l'utilisateur
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .or(`id.eq.${id},playerId.eq.${id}`) // Recherche par `id` ou `player_id`
        .single(); // Retourne un seul utilisateur

      if (error) {
        return res.status(404).json({ error: 'Utilisateur introuvable.' + error });
      }

      return res.status(200).json(data); // Retourne l'utilisateur trouvé
    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur.' + error });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Méthode ${req.method} non autorisée.`);
}
