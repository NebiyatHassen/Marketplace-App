import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import colors from "../../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function NewListItem({ onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="plus-circle"
          size={40}
          color={colors.white}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#AAD9BB",
    borderColor: colors.white,
    borderWidth: 10,
    width: 75,
    height: 75,
    borderRadius: 40,
    bottom: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
