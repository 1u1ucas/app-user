import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { supabase } from '../utils/db';
import Cors from 'cors';

const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: '*',
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: (req: NextApiRequest, res: NextApiResponse, result: (result: any) => void) => void) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Run the middleware
  await runMiddleware(req, res, cors);

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

      //vérifie que il n'y a pas un score plus grand pour le même joueur et le même jeu
      const { data: scoreData, error: scoreError } = await supabase
        .from('score')
        .select('score')
        .eq('playerId', playerId)
        .eq('gameId', gameId)
        .single();
      
      if (scoreError) {
        console.error("Erreur lors de la récupération du score:", scoreError); // Log l'erreur détaillée
        return res.status(500).json({ error: scoreError.message || 'Erreur inconnue lors de la récupération du score' });
      }

      if (scoreData && scoreData.score >= score) {
        return res.status(200).json({ message: 'Score plus petit ou égal au score actuel' });
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