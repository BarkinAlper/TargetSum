import { Pressable, StyleSheet, Text, View } from "react-native";

type RandomNumberProps = {
  number: number;
  id: number;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: (id: number) => void;
};

export default function RandomNumber({
  number,
  isSelected,
  isDisabled,
  id,
  onPress,
}: RandomNumberProps) {
  function handlePress() {}

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
          !pressed && isSelected && styles.selected,
        ]}
        disabled={isDisabled}
      >
        <Text style={[styles.number, isSelected && styles.selected]}>
          {number}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "30.5%",
    aspectRatio: 1,
    marginBottom: 14,
  },

  pressed: {
    backgroundColor: "#C7D2FE",
    opacity: 0.45,
  },
  selected: {
    backgroundColor: "#C7D2FE",
    opacity: 0.7,
  },

  button: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  number: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },
});
