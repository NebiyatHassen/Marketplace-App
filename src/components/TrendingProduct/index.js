import { View, Text, Dimensions } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Carousal from "react-native-snap-carousel";
import Card from "../Card";

var { width } = Dimensions.get("window");

export default function TrendingMovies({ data }) {
  // console.log("Trending Movies", data);
  const navigation = useNavigation();

  const handleClick = (item) => {
    navigation.navigate("Movie", { item });
  };

  return (
    <View className="mt-2 mb-4 ">
      <View className="flex-row justify-between">
        <Text className="text-black text-lg font-bold mx-4 mb-4">
          New Products
        </Text>
      </View>

      {/* Carousal */}
      <Carousal
        data={data}
        renderItem={({ item }) => (
          <Card item={item} handleClick={handleClick} style={{ width: 320 }} />
        )}
        firstItem={1}
        inactiveSlideScale={0.86}
        inactiveSlideOpacity={0.6}
        sliderWidth={width}
        itemWidth={width * 0.9}
        slideStyle={{ display: "flex", alignItems: "center" }}
      />
    </View>
  );
}
