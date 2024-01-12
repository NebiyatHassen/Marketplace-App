import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constant/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorMessage from "../components/ErrorMsg";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { InfoToast } from "react-native-toast-message";

const Login = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [loginError, setLoginError] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    if (!email.trim() && !password.trim()) {
      setEmailError("Email is required");
      setPassError("Password is required");
      return;
    } else if (!email.trim()) {
      setEmailError("Email is required");
      return;
    } else if (!password.trim()) {
      setPassError("Password is required");
      return;
    } else if (password.length < 8 && !emailRegex.test(email)) {
      setPassError(" Password Must be 8 Characters Long");
      setEmailError(" Please Enter a Valid Email Address.");
      return;
    } else if (password.length < 8) {
      setPassError(" Password Must be 8 Characters Long");
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError(" Please Enter a Valid Email Address.");
      return;
    }

    try {
      const url = "http://10.194.65.23:9000/api/v1/users/login";

      const requestBody = {
        email: email,
        password: password,
      };
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
          const { message } = await response.json();
          setLoginError(message);
        }
        const data = await response.json();
        if (data.status === "success") {
          await AsyncStorage.removeItem("jwtToken");
          await AsyncStorage.setItem("jwtToken", data.token);
          const userToken = await AsyncStorage.getItem("jwtToken");
          await AsyncStorage.setItem("userData", JSON.stringify(data.user));
          const userInfo = await AsyncStorage.getItem("userData");
          console.log(userInfo);
          setEmail("");
          setPassword("");
          navigation.navigate("HomeTab");
        }
      } catch (error) {
        throw error;
      }
    } catch (error) {}
  };
  const handleresetpassword = async () => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Check your inbox.");
    } catch (error) {
      console.log(error);
      alert("Error sending password reset email.");
    }
  };

  return (
    <SafeAreaView
      edges={["top", "right", "bottom", "left"]}
      style={{ flex: 1, backgroundColor: COLORS.white }}
    >
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <Text
          style={{
            fontSize: 35,
            fontWeight: "600",
            color: "#AAD9BB",
            marginLeft: 2,
            marginTop: 67,
            marginBottom: 10,
          }}
        >
          Login
        </Text>
        {loginError && <ErrorMessage error={loginError} />}
        <View style={{ marginBottom: 12, marginTop: 8 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Email address
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor="#cccccc"
              keyboardType="email-address"
              style={{
                width: "100%",
              }}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
                setLoginError("");
              }}
            />
          </View>
          {emailError && <ErrorMessage error={emailError} />}
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Password
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#cccccc"
              secureTextEntry={isPasswordShown}
              style={{
                width: "100%",
              }}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPassError("");
                setLoginError("");
              }}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 12,
              }}
            >
              {isPasswordShown == true ? (
                <Ionicons name="eye" size={24} color={COLORS.black} />
              ) : (
                <Ionicons name="eye-off" size={24} color={COLORS.black} />
              )}
            </TouchableOpacity>
          </View>
          {passError && <ErrorMessage error={passError} />}
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text>Sign In</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        ></View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        ></View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16, color: COLORS.black }}>
            Don't have an account ?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text
              style={{
                fontSize: 16,
                color: "#AAD9BB",
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginBtn: {
    backgroundColor: "#AAD9BB",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 6,
    marginBottom: 15,
    marginTop: 30,
    width: "100%",
    height: 45,
    alignItems: "center",
  },
});

export default Login;
