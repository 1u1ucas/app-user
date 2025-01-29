'use client';

import { useState, useEffect, use } from "react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  'https://hpjstdrieovdnwvxuaxa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwanN0ZHJpZW92ZG53dnh1YXhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzk4MTQ1MSwiZXhwIjoyMDUzNTU3NDUxfQ.WW8V-p37LPTsgRFdvY1rnMKCQcF38pe7YQMQNHgaZbs'
);

export default function UserPage() {
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [score, setScore] = useState<any>(null);
    const [globalScore, setGlobalScore] = useState<any>(null);
    const [gameName, setGameName] = useState<any>([
        {
            id: 0,
            name: "Beat Saber"
        },
        {
            id: 1,
            name: "Break and Build"
        },
        {
            id: 2,
            name: "Escape Room"
        },
        {
            id: 3,
            name: "Gran Turismo 7"
        },
        {
            id: 4,
            name: "Puzzle Tracer"
        }
    ]);  
    
    
    const handleInserts = (payload: any) => {
        fetchData();
      }

    const fetchData = async () => {
        try {
             const playerId = localStorage.getItem('playerId');
            setPlayerId(playerId);
            const res = await fetch(`/api/users/${playerId}`);
            const data = await res.json();
            setUser(data);

            const resScore = await fetch(`/api/score/getByPlayerId?playerId=${playerId}`, {
                method: 'GET',
            });
            const dataScore = await resScore.json();
            console.log(dataScore);
            setScore(dataScore);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {

        if(!supabase) return;
        supabase
          .channel('score')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'score' }, handleInserts)
          .subscribe()

          supabase
          .channel('user')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user' }, handleInserts)
          .subscribe()

        if (localStorage.getItem('playerId')) {
            fetchData();
          }
        }, [supabase]);

        useEffect(() => {
            if (score) {
                setGlobalScore(score.reduce((acc: number, curr: any) => acc + curr.score, 0));
            }
        }, [score]);

    return (
        <div className="flex flex-col items-center justify-start gap-4 w-full sm:px-10 px-2">
            <h1 className="text-6xl font-semibold">{user?.username}</h1>
            <p className="text-xl ">Ton code (celui pour pouvoir obtenir un score) est :</p>
            <span className="text-8xl font-bold text-[#00C4B3]">{user?.playerId}</span>
            <h2 className="text-4xl font-bold">Ton score Global</h2>
            <div
              className={`firstRank rank flex rounded-full text-white w-3xs min-h-1/5 text-center justify-between sm:gap-5 px-2 py-4 `}
            >
              <div className="sm:w-16 sm:h-16 avatar flex self-center"> </div>
              <div className="flex flex-row self-center gap-4 pr-4">
              <p>{user?.username}<span className="text-xs opacity-50">#{user?.playerId}</span></p>
              <p>Score: {globalScore}</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-start gap-4 w-full sm:px-10 px-2">
            <h2 className="text-4xl font-bold">Ton score par jeu</h2>
            {score?.map((game: any, index: number) => (
                <div
                  key={index}
                  className={`rank flex rounded-full text-white w-3xs min-h-1/5 text-center justify-between sm:gap-5 px-2 py-4 `}
                >
                  <div className="sm:w-16 sm:h-16 avatar flex self-center "> </div>
                  <div className="flex flex-row self-center gap-4 pr-4">
                    <p>{gameName[game.gameId].name}</p>
                    <p>Score: {game.score}</p>
                  </div>
                </div>
            ))}
            </div>
        </div>
    )

}