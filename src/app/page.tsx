"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/score/getAll");
        const data = await res.json();

        const groupedParticipants = data.reduce((acc: any, participant: any) => {
          if (acc[participant.playerId]) {
            acc[participant.playerId].score += participant.score;
          } else {
            acc[participant.playerId] = { ...participant };
          }
          return acc;
        }, {});

        const sortedParticipants = Object.values(groupedParticipants).sort(
          (a: any, b: any) => b.score - a.score
        );

        setParticipants(sortedParticipants);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!username) {
      setError('Le champ username est obligatoire');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Erreur inconnue');
      } else {
        setUser(result.user);
      }
    } catch (err) {
      setError('Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <h2>Entrez un pseudo pour participer aux expériences !</h2>
        {user ? (
          <div>
            <h2>Utilisateur créé avec succès !</h2>
            <p>Nom d'utilisateur : {user.username}</p>
            <p>Player ID : {user.playerId}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Nom d'utilisateur :</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Chargement...' : 'Créer'}
            </button>
          </form>
        )}
      </div>
      {/* Navigation - Onglets */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button style={{ padding: '10px 20px', backgroundColor: '#4caf50', border: 'none', borderRadius: '5px' }}>
          Classement général
        </button>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            border: 'none',
            borderRadius: '5px',
            marginLeft: '10px',
          }}
        >
          Leaderboard
        </button>
      </div>

      {/* Classement */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <h2 style={{ color: 'white' }}>Global Rank - {participants.length} PARTICIPANTS</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {participants.map((participant, index) => (
            <div
              key={index}
              style={{
                backgroundColor: index === 0 ? 'gold' : '#333',
                color: 'white',
                padding: '15px',
                margin: '10px',
                width: '250px',
                textAlign: 'center',
                borderRadius: '8px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              }}
            >
              <p>{participant.username}</p>
              <p>Score: {participant.score}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>
        <h1 style={{ fontSize: '50px', letterSpacing: '5px' }}>DIGINIGHT</h1>
        <h2>LES MONDES PARALLÈLES</h2>
      </div>
    </div>
  );
}