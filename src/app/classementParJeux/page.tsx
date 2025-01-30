'use client';

import { useState, useEffect } from "react";
import LeaderBoardTimer from "@/components/leaderBoardTimer"

export default function ClassementParJeux() {
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (timer === 6) {
            setTimer(0);  
        }
        const interval = setInterval(() => {
            setTimer(timer + 1);
        }, 5000);

        return () => {
            clearInterval(interval);
        }
    }, [timer]);

    return (
        <div className = "mt-10">
            <LeaderBoardTimer activity={timer} setActivity={setTimer} />
        </div>
    )
}