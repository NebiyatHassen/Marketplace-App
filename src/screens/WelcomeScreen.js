import { View, Text, Image, Touchable, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-end items-center space-y-10 relative">
      <Image
        source={require("../../assets/images/welcome.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      />

      <StatusBar style="light" />


      <View className="flex items-center justify-center py-28 max-w-[80%]">
        <View className="bg-red-900 p-4 rounded-3xl">
          <Text className="text-white text-4xl font-extrabold tracking-widest my-4">
         CG
          </Text>
        </View>
        <Text className="text-white text-4xl font-bold tracking-widest my-4">
          Cinema Go
        </Text>

        <Text className="text-white tracking-widest mb-2 text-lg text-center font-medium">
          Watch and find movies that bring your mood back.
        </Text>
      </View>

      <View className="my-4 mb-36">
        <TouchableOpacity
          className="px-12 py-3 rounded-lg bg-red-900"
          onPress={() => navigation.navigate("HomeTab")}
        >
          <Text className="text-white text-lg font-medium">Explore</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
