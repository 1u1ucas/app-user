"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [active, setActive] = useState("general");

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
    <section>
      <div className="container">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <h2>Entrez un pseudo pour participer aux expériences !</h2>
        {user ? (
          <div>
            <h2>Utilisateur créé avec succès !</h2>
            <p>Nom d'utilisateur : {user.username}</p>
            <p>Player ID : {user.playerId}</p>
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Entrez votre pseudo"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            <button className="submitButton" type="submit" disabled={loading}>
              {loading ? 'Chargement...' : 'S\'inscrire'}
            </button>
          </form>
        )}
      </div>
      <div className="relative flex background rounded-full h-14 w-96">
      {/* Effet de slide */}
      <motion.div
        className="absolute bg-[#00C8C8] rounded-full h-full w-1/2"
        animate={{ x: active === "leaderboard" ? "100%" : "0%" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      
      {/* Bouton "Classement général" */}
      <button
        onClick={() => setActive("general")}
        className={`relative z-10 flex-1 font-bold py-2 rounded-full ${
          active === "general" ? "text-black" : "text-white"
        }`}
      >
        Classement général
      </button>

      {/* Bouton "Leaderboard" */}
      <button
        onClick={() => setActive("leaderboard")}
        className={`relative z-10 flex-1 font-bold py-2 rounded-full ${
          active === "leaderboard" ? "text-black" : "text-white"
        }`}
      >
        Leaderboard
      </button>
    </div>

      {/* Classement */}
      <div>
        <div>
        <svg width="25" height="33" viewBox="0 0 25 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Group 1200">
<path id="Icon" d="M13.0405 0.307813C12.7999 -0.110742 12.2011 -0.110743 11.9605 0.307813L10.2661 3.2555C10.1472 3.46226 9.9418 3.60336 9.70764 3.63906L6.53219 4.12321C5.99884 4.20452 5.81176 4.88427 6.22712 5.23164L8.5927 7.21002C8.81168 7.39315 8.91464 7.68201 8.86144 7.96399L8.24265 11.2443C8.14483 11.7629 8.6841 12.1658 9.14681 11.9198L12.1369 10.3306C12.3645 10.2096 12.6365 10.2096 12.8641 10.3306L15.8542 11.9198C16.3169 12.1658 16.8562 11.7629 16.7583 11.2443L16.1395 7.96399C16.0863 7.68201 16.1893 7.39315 16.4083 7.21002L18.7739 5.23164C19.1892 4.88427 19.0021 4.20452 18.4688 4.12321L15.2933 3.63906C15.0592 3.60336 14.8538 3.46226 14.7349 3.2555L13.0405 0.307813Z" fill="#F9CF66"/>
<rect id="Rectangle 2655" x="9.00049" y="14.9939" width="7" height="18" rx="1" fill="#F9CF65"/>
<rect id="Rectangle 2656" x="0.000488281" y="19.9939" width="7" height="13" rx="1" fill="#F9CF65"/>
<rect id="Rectangle 2657" x="18.0005" y="24.9939" width="7" height="8" rx="1" fill="#F9CF65"/>
</g>
</svg>
 
        <h2>Global Rank - {participants.length} PARTICIPANTS</h2>
        </div>
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
    </section>
  );
}