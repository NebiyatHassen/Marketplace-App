import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function AppText({ children, style, numberOfLines }) {
  return (
    <View>
      <Text style={[styles.text, style]} numberOfLines={numberOfLines}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
});
