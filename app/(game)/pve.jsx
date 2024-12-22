import { LinearGradient } from "expo-linear-gradient";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import WheelChoice from "../../components/WheelChoice";
import HandImage from "../../components/HandImage";
import { nextRound } from "../../utils";
import { useGameMode } from "../../contexts/GameModeContext";
import useCountdown from "../../hooks/useCountdown";
import useRoundCountdown from "../../hooks/useRoundCountdown";

export default function Pve() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);
  const [score, setScore] = useState({
    player: 0,
    bot: 0,
  });
  const { rounds } = useGameMode();
  const translateY = useAnimatedValue(500);
  const { countdown: gameCountdown, isReady, resetCountdown } = useCountdown(3);
  const {
    roundCountdown,
    currentRound,
    showChoice,
    setRoundCountdown,
    setShowChoice,
  } = useRoundCountdown(
    5,
    isReady,
    playerChoice,
    botChoice,
    setPlayerChoice,
    setBotChoice,
    setScore,
    "player",
    "bot"
  );

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: showChoice ? 0 : 500,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showChoice]);

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.background}
        colors={["#9AC6FF", "#5D68A1", "#002C5F"]}
      />
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <View style={styles.countdownContainer}>
        {!isReady && <Text style={styles.gameCountdown}>{gameCountdown}</Text>}
        {isReady && (
          <View>
            <Text style={styles.roundCountdown}>Giliranmu!</Text>
            <Text style={styles.roundCountdown}>{roundCountdown}</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() =>
            nextRound(
              setPlayerChoice,
              setBotChoice,
              setShowChoice,
              setRoundCountdown
            )
          }
        >
          <Text>NEXT ROUND</Text>
        </TouchableOpacity>
        <Text>Player Score {score.player}</Text>
        <Text>Bot Score {score.bot}</Text>
        <Text>{currentRound >= rounds && "ROUND END"}</Text>
      </View>
      {isReady && !showChoice && <WheelChoice setChoice={setPlayerChoice} />}
      {showChoice && (
        <Animated.View
          style={{
            ...styles.playerHandContainer,
            transform: [{ translateY: translateY }],
          }}
        >
          <HandImage choice={playerChoice} />
        </Animated.View>
      )}
      {showChoice && (
        <Animated.View
          style={{
            ...styles.opponentHandContainer,
            transform: [{ rotate: "180deg" }, { translateY: translateY }],
          }}
        >
          <HandImage choice={botChoice} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    height: "100%",
  },
  logo: {
    opacity: 0.06,
    width: 190,
    height: 190,
    marginVertical: "auto",
    position: "absolute",
  },
  countdownContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 50,
  },
  gameCountdown: {
    fontWeight: 700,
    color: "#FFFFFF",
    fontSize: 48,
  },
  roundCountdown: {
    fontWeight: 700,
    color: "#FFFFFF",
    fontSize: 36,
    textAlign: "center",
  },
  playerHandContainer: {
    position: "absolute",
    bottom: -100,
    width: 230,
    height: 460,
    zIndex: 0,
  },
  opponentHandContainer: {
    position: "absolute",
    top: -100,
    width: 230,
    height: 460,
    zIndex: 0,
  },
});
