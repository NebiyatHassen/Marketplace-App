import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constant/colors";
import { Ionicons } from "@expo/vector-icons";
import ErrorMessage from "../components/ErrorMsg";
import { Alert } from "react-native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
const Signup = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setconfirmPass] = useState("");

  const [fnError, setFnError] = useState("");
  const [lnError, setlnError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [emailError, setemailError] = useState("");
  const [confirmPasswordError, setconfirmPasswordError] = useState("");
  const [passError, setPassError] = useState("");
  const [password, setPassword] = useState("");
  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "bc92bf12-06f7-4eb4-ae30-ed6774f65bfa",
        })
      ).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }
  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phoneRegex = /^\+?\d{9,}$/;

    if (!firstName.trim()) {
      setFnError("First Name is required");
    }
    if (!lastName) {
      setlnError("Last Name is required");
    }
    if (!email) {
      setemailError("Email is required");
    }
    if (!phoneNumber) {
      setPhoneNumberError("Phone Number is required");
    }
    if (!pass) {
      setPassError("Password is required");
    }
    if (!confirmPass) {
      setconfirmPasswordError("Confirm Password is required");
    }
    if (pass.length < 8) {
      setPassError("Password Must be 8 Characters Long");
    }
    if (!emailRegex.test(email)) {
      setemailError("Please Enter a Valid Email Address.");
    }
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneNumberError("Please Enter a Valid Phone Number");
    }
    const pushToken = await registerForPushNotificationsAsync();

    try {
      const url = "http://10.194.65.23:9000/api/v1/users/signup";

      const requestData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        password: pass,
        passwordConfirm: confirmPass,
        pushToken: pushToken,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      };

      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Response:", data);
          navigation.navigate("Login");
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    } catch (error) {
      {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert(
            "Error",
            "The email address is already in use. Please use a different email."
          );
        } else {
          console.error("Error signing up:", error.message);
        }
      }
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, marginHorizontal: 22 }}>
          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                fontSize: 35,
                fontWeight: "600",
                color: "#AAD9BB",
                marginLeft: 2,
                marginTop: 25,
              }}
            >
              Sign Up
            </Text>
          </View>
          <View style={{ marginBottom: 5 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 5,
              }}
            >
              First Name
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
                placeholder="Enter Your First Name"
                placeholderTextColor="#cccccc"
                keyboardType="email-address"
                style={{
                  width: "100%",
                }}
                value={firstName}
                onChangeText={(text) => {
                  setfirstName(text);
                  setFnError("");
                }}
              />
            </View>
          </View>
          {fnError && <ErrorMessage error={fnError} />}
          <View style={{ marginBottom: 5 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 5,
              }}
            >
              Last Name
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
                placeholder="Enter Your Last Name"
                placeholderTextColor="#cccccc"
                keyboardType="email-address"
                style={{
                  width: "100%",
                }}
                value={lastName}
                onChangeText={(text) => {
                  setlastName(text);
                  setlnError("");
                }}
              />
            </View>
          </View>
          {lnError && <ErrorMessage error={lnError} />}
          <View style={{ marginBottom: 5 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 5,
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
                placeholder="Enter You Email Address"
                placeholderTextColor="#cccccc"
                keyboardType="email-address"
                style={{
                  width: "100%",
                }}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setemailError("");
                }}
              />
            </View>
          </View>
          {emailError && <ErrorMessage error={emailError} />}
          <View style={{ marginBottom: 5 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 8,
              }}
            >
              Phone Number
            </Text>

            <View
              style={{
                width: "100%",
                height: 48,
                borderColor: COLORS.black,
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingLeft: 22,
              }}
            >
              <TextInput
                placeholder="+251"
                placeholderTextColor="#cccccc"
                keyboardType="numeric"
                style={{
                  width: "12%",
                  borderRightWidth: 1,
                  borderLeftColor: COLORS.grey,
                  height: "100%",
                }}
              />

              <TextInput
                placeholder="Enter Your Phone Number"
                placeholderTextColor="#cccccc"
                keyboardType="numeric"
                style={{
                  width: "80%",
                }}
                value={phoneNumber}
                onChangeText={(text) => {
                  setphoneNumber(text);
                  setPhoneNumberError("");
                }}
              />
            </View>
          </View>
          {phoneNumberError && <ErrorMessage error={phoneNumberError} />}

          <View style={{ marginBottom: 5 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 5,
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
                placeholder="Enter Your Password"
                placeholderTextColor="#cccccc"
                secureTextEntry={isPasswordShown}
                style={{
                  width: "100%",
                }}
                value={pass}
                onChangeText={(text) => {
                  setPass(text);
                  setPassError("");
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
          </View>
          {passError && <ErrorMessage error={passError} />}
          <View style={{ marginBottom: 0 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 5,
              }}
            >
              Confirm Password
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
                placeholder="Confirm Your Password"
                placeholderTextColor="#cccccc"
                secureTextEntry={isPasswordShown}
                style={{
                  width: "100%",
                }}
                value={confirmPass}
                onChangeText={(text) => {
                  setconfirmPass(text);
                  setconfirmPasswordError("");
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
          </View>
          {confirmPasswordError && (
            <ErrorMessage error={confirmPasswordError} />
          )}
          <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
            <Text>Sign Up</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 5,
            }}
          >
            <Text style={{ fontSize: 16, color: COLORS.black }}>
              Already have an account ?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={{
                  fontSize: 16,
                  color: "#AAD9BB",
                  fontWeight: "bold",
                  marginLeft: 6,
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginBtn: {
    backgroundColor: "#AAD9BB",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 6,
    marginBottom: 3,
    marginTop: 30,
    width: "100%",
    height: 45,
    alignItems: "center",
  },
});
export default Signup;
