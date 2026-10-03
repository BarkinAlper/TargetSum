import Game from "@/components/Game";
import { useState } from "react";

export default function HomeScreen() {
  const [gameId, setGameId] = useState(1);

  function resetGame() {
    setGameId((current) => current + 1);
  }

  return (
    <Game
      key={gameId}
      randomNumberCount={9}
      initialSeconds={100}
      onPlayAgain={resetGame}
    />
  );
}
