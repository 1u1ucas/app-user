import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../utils/db';

// Génère un ID joueur aléatoire à 4 chiffres
const generatePlayerId = async (): Promise<string> => {
  const playerId = Math.floor(1000 + Math.random() * 9000).toString(); // Génère un nombre entre 1000 et 9999

  // Vérifie si cet ID est déjà utilisé
  const { data } = await supabase
    .from('user')
    .select('playerId')
    .eq('playerId', playerId)
    .single();

  // Si l'ID existe déjà, on génère un nouveau
  if (data) {
    return generatePlayerId();
  }

  return playerId;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Le champ username est obligatoire' });
    }

    try {
      // Génère un player_id unique
      const playerId = await generatePlayerId();

      // Vérifie que player_id et username sont valides
      if (typeof username !== 'string' || typeof playerId !== 'string') {
        return res.status(400).json({ error: 'Invalid data format' });
      }

      // Insère l'utilisateur dans la base de données
      const { data, error } = await supabase
        .from('user')
        .insert([{ username, playerId }]) // Assure-toi d'envoyer un tableau d'objets, même pour une seule insertion
        .select();

      if (error) {
        console.error("Erreur lors de l'insertion dans Supabase:", error); // Log l'erreur détaillée
        return res.status(500).json({ error: error.message || 'Erreur inconnue lors de l\'insertion' });
      }

      return res.status(201).json({ user: data[0] });
    } catch (error) {
      console.error("Erreur serveur:", error); // Log l'erreur serveur
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Méthode ${req.method} non autorisée`);
}
