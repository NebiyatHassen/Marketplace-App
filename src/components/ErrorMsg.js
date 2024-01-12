import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppText from "./AppText";
import colors from "../../config/colors";
const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <View>
      <AppText style={styles.errorMessage}>{error}</AppText>
    </View>
  );
};

export default ErrorMessage;

const styles = StyleSheet.create({
  errorMessage: {
    color: colors.danger,
  },
});
