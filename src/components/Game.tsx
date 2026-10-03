/*  */ import { useEffect, useMemo, useState } from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import RandomNumber from "@/components/RandomNumber";
import { SafeAreaView } from "react-native-safe-area-context";

type GameProps = {
  randomNumberCount: number;
  initialSeconds: number;
  onPlayAgain: () => void;
};

type GameStatus = "playing" | "won" | "lost";

function generateRandomNumber() {
  return Math.floor(2 + 9 * Math.random());
}

function generateRandomNumbers(count: number) {
  return Array.from({ length: count }, () => generateRandomNumber());
}

function sumNumbers(numbers: number[]) {
  return numbers
    .slice(0, numbers.length - 2)
    .reduce((sum, number) => sum + number, 0);
}

function shuffleNumbers(numbers: number[]) {
  const shuffled = [...numbers];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
type GameData = {
  target: number;
  randomNumbers: number[];
};
function createGameData(randomNumberCount: number): GameData {
  const numbers = generateRandomNumbers(randomNumberCount);
  const target = sumNumbers(numbers);
  return {
    target,
    randomNumbers: shuffleNumbers(numbers),
  };
}

export default function Game({
  randomNumberCount,
  initialSeconds,
  onPlayAgain,
}: GameProps) {
  const [gameData] = useState(() => createGameData(randomNumberCount));

  const { target, randomNumbers } = gameData;
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  function isNumberSelected(numberIndex: number) {
    return selectedIndexes.includes(numberIndex);
  }
  function selectNumber(numberId: number) {
    setSelectedIndexes((current) =>
      current.includes(numberId) ? current : [...current, numberId],
    );
  }

  const sumSelected = useMemo(
    () => selectedIndexes.reduce((sum, id) => sum + randomNumbers[id], 0),
    [selectedIndexes, randomNumbers],
  );

  function getGameStatus(): GameStatus {
    if (remainingSeconds < 0) {
      return "lost";
    }

    if (sumSelected < target) {
      return "playing";
    }

    if (sumSelected === target) {
      return "won";
    }

    return "lost";
  }
  const gameStatus = getGameStatus();

  const statusStyles = {
    playing: styles.statusPlaying,
    won: styles.statusWon,
    lost: styles.statusLost,
  };

  useEffect(() => {
    if (gameStatus !== "playing") {
      return;
    }

    const intervalId = setInterval(() => {
      setRemainingSeconds((current) => current - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [gameStatus]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.timer}>Kalan süre: {remainingSeconds}</Text>

      <Text style={[styles.target, statusStyles[gameStatus]]}>{target}</Text>
      <Text style={styles.statusText}>
        {gameStatus === "won"
          ? "Kazandınız!"
          : gameStatus === "lost"
            ? "Oyun bitti"
            : "Hedef toplamı bulun"}
      </Text>

      <View style={styles.randomContainer}>
        {randomNumbers.map((number, index) => (
          <RandomNumber
            key={index}
            number={number}
            id={index}
            isSelected={isNumberSelected(index)}
            isDisabled={isNumberSelected(index) || gameStatus !== "playing"}
            onPress={selectNumber}
          />
        ))}

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPlayAgain}
          style={styles.playAgain}
        >
          <Text style={styles.playAgainText}>Tekrar Oyna</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ddd",
  },

  timer: {
    marginTop: 8,
    marginBottom: 12,
    fontSize: 18,
    textAlign: "center",
  },

  target: {
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 42,
    fontWeight: "700",
    textAlign: "center",
  },

  randomContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },

  statusPlaying: {
    backgroundColor: "#d9dee5",
  },
  statusWon: {
    backgroundColor: "#bfe7c5",
  },
  statusLost: {
    backgroundColor: "#f4c2c2",
  },
  statusText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
  },
  playAgain: {
    flex: 1,
    marginTop: "auto",
    backgroundColor: "#1D4ED8",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  playAgainText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
