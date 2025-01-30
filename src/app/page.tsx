"use client";

import { useState, useEffect } from "react";

import GlobalRank from "../components/globalRank";
import LeaderBoard from "../components/leaderBoard";
import BoardButton from "../components/boardButton";
import UserPage from "../components/userPage";
import { set } from "react-hook-form";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [active, setActive] = useState("general");
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [userPageActive, setUserPageActive] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('playerId')) {
      setPlayerId(localStorage.getItem('playerId'));
      setUserPageActive(true);
    }
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
        localStorage.setItem('playerId', result.user.playerId);
      }
    } catch (err) {
      setError('Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <section className="flex flex-col justify-between items-center self-center pt-24 p-2 gap-20">
      <div className="flex flex-col items-center gap-10">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {playerId ? (
          <div>
            <button 
              onClick={() => {
                setUserPageActive(!userPageActive);
              }}
              className={`profilButton rounded-full flex items-center py-6 ${userPageActive ? 'px-7' : 'px-14'} text-3xl`}>
                {userPageActive ? '✖' : 'Voir mon profil'}
            </button>
          </div>
        ) : (
          <form className="flex flex-col items-center gap-5" onSubmit={handleSubmit}>
            <h2 className="text-center">Entrez un pseudo pour participer aux expériences !</h2>
              <input className="flex w-full h-14 rounded-full p-5 justify-center items-center text-center g-5"
                type="text"
                id="username"
                name="username"
                placeholder="Entrez votre pseudo"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            <button className="submitButton flex py-4 px-20 justify-center items-center gap-10 rounded-full w-fit text-black font-semibold  " type="submit" disabled={loading}>
              {loading ? 'Chargement...' : 'S\'inscrire'}
            </button>
          </form>
        )}
      
      </div>
      {playerId && (
        <>
          {userPageActive ? (
            <UserPage />
          ) : (
            <>
              <BoardButton active={active} setActive={setActive} />
              {active === "general" && <GlobalRank />}
              {active === "leaderboard" && <LeaderBoard />}
            </>
          )}
        </>
      )}
    </section>
  );
}