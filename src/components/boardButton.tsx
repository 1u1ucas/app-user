import { motion } from "framer-motion";

type BoardButtonProps = {
  active: string;
  setActive: (value: string) => void;
};

export default function BoardButton({ active, setActive }: BoardButtonProps) {
  return (
    <div className="relative flex background rounded-full h-fit w-fit gap-12">
      {/* Effet de slide */}
      <motion.div
        className="absolute bg-[#00C8C8] rounded-full h-full w-1/2"
        animate={{ x: active === "leaderboard" ? "100%" : "0%" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      
      {/* Bouton "Classement général" */}
      <button
        onClick={() => setActive("general")}
        className={`relative z-10 flex-1 font-bold py-2 rounded-full whitespace-nowrap m-2 ${
          active === "general" ? "text-black" : "text-white"
        }`}
      >
        Classement général
      </button>

      {/* Bouton "Leaderboard" */}
      <button
        onClick={() => setActive("leaderboard")}
        className={`relative z-10 flex-1 self-center font-bold py-2 rounded-full m-2 ${
          active === "leaderboard" ? "text-black" : "text-white"
        }`}
      >
        Leaderboard‎ ‎ ‎ ‎ ‎ ‎ ‎ 
      </button>
    </div>
  );
}