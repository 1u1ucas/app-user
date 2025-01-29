"use client";

import { useState, useEffect } from "react";

const games = [
  { id: 0, name: "Beat Saber" },
  { id: 1, name: "Break and Build" },
  { id: 2, name: "Escape Room" },
  { id: 3, name: "Gran Turismo 7" },
  { id: 4, name: "Puzzle Tracer" },
];

export default function Admin() {
  const [playerId, setPlayerId] = useState("");
  const [gameId, setGameId] = useState<number>(games[0].id)
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setGameId(Number(localStorage.getItem('gameId')) || games[0].id);
    }, []);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();



    if (!playerId || !gameId || !score) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    if (isNaN(Number(playerId)) || Number(playerId) < 1000 || Number(playerId) > 9999) {
      setError("L'ID du joueur doit être un nombre entre 1000 et 9999");
      return;
    }

    if (isNaN(Number(score)) || Number(score) < 0 || Number(score) > 20) {
      setError("Le score doit être un nombre entre 0 et 20");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/score/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerId, gameId, score }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Erreur inconnue");
      } else {
        alert("Score ajouté avec succès");
        localStorage.setItem("gameId", gameId.toString());
      }
    } catch (err) {
      setError("Erreur lors de l'ajout du score");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col justify-between items-center self-center pt-24 p-2 gap-40">
      <div className="flex flex-col items-center gap-10">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form className="flex flex-col items-center gap-5" onSubmit={handleSubmit}>
          <h2 className="text-center">Ajouter un score</h2>
          <input
            className="flex w-full h-14 rounded-full p-5 justify-center items-center text-center g-5"
            type="text"
            id="playerId"
            name="playerId"
            placeholder="Entrez l'ID du joueur (1000-9999)"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            required
          />
          <select
            className="flex w-full h-14 rounded-full p-5 justify-center items-center text-center g-5 text-black"
            id="gameId"
            name="gameId"
            value={gameId}
            onChange={(e) => setGameId(Number(e.target.value))}
            required
          >
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
          <input
            className="flex w-full h-14 rounded-full p-5 justify-center items-center text-center g-5"
            type="text"
            id="score"
            name="score"
            placeholder="Entrez le score (0-20)"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
          />
          <button
            className="submitButton flex py-4 px-20 justify-center items-center gap-10 rounded-full w-fit text-black font-semibold"
            type="submit"
            disabled={loading}
          >
            {loading ? "Chargement..." : "Ajouter"}
          </button>
        </form>
      </div>
    </section>
  );
}