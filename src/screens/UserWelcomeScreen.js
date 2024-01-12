import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={{ color: "#AAD9BB" }}>Yenesuq</Text> Marketplace
      </Text>
      <Image
        source={require("../../images/welcomeImage.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.subTitle}>
        The best marketplace in <Text style={{ color: "#AAD9BB" }}>WKU</Text>{" "}
        Campus
      </Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => navigation.navigate("Login")}
        >
          <Text>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <Text>New around here ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.registerBtn}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 400,
  },
  btnContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginBtn: {
    backgroundColor: "#AAD9BB",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 6,
    marginBottom: 15,
    marginTop: 30,
    width: "70%",
    alignItems: "center",
  },
  registerBtn: {
    marginTop: 16,
    marginLeft: 10,
    marginBottom: 15,
    color: "#AAD9BB",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default WelcomeScreen;
