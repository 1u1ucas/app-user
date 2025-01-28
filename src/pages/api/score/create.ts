import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../utils/db';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { playerId, gameId, score } = req.body;

    if (!playerId || !gameId || !score) {
      return res.status(400).json({ error: 'playerId, gameId et score sont requis' });
    }

    try {

      // Vérifie que playerId, gameId et score sont valides
      if (typeof playerId !== 'number' || typeof gameId !== 'number' || typeof score !== 'number') {
        return res.status(400).json({ error: 'Invalid data format' });
      }

      //récupère le username avec le playerId
      const { data: playerData, error: playerError } = await supabase
      .from('user')
      .select('*')
      .or(`playerId.eq.${playerId}`)
      .single();

      if (playerError) {
        console.error("Erreur lors de la récupération de l'utilisateur:", playerError); // Log l'erreur détaillée
        return res.status(500).json({ error: playerError.message || 'Erreur inconnue lors de la récupération de l\'utilisateur' });
      }

      if (!playerData) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });

      }

      const username = playerData.username;

      // Insère le score dans la base de données
      const { data, error } = await supabase
        .from('score')
        .insert([{ playerId, gameId, score, username }]) // Assure-toi d'envoyer un tableau d'objets, même pour une seule insertion
        .select();

      if (error) {
        console.error("Erreur lors de l'insertion dans Supabase:", error); // Log l'erreur détaillée
        return res.status(500).json({ error: error.message || 'Erreur inconnue lors de l\'insertion' });
      }

      return res.status(201).json({ score: data[0] });
    } catch (error) {
      console.error("Erreur serveur:", error); // Log l'erreur serveur
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Méthode ${req.method} non autorisée`);
}
