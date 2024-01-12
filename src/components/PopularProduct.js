import {
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { image500 } from "../../utils/moviesapi";
import { Linking } from "react-native";
import CategoryList from "./categories/CategoryList";
import Card from "./Card";

const { width, height } = Dimensions.get("window");

export default function PopularMovie({ title, data }) {
  const navigation = useNavigation();

  const handleClick = (item) => {
    navigation.navigate("Movie", { item });
  };
  const renderItem = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback
        key={index}
        onPress={() => navigation.push("Movie", item)}
      >
        <View className="space-y-1 mr-4 ">
          <Image
            source={{
              uri:
                image500(item.poster_path) ||
                "https://th.bing.com/th/id/R.983b8085251688a15240a6ab11b97c39?rik=MlZlZUcTUEgjyw&riu=http%3a%2f%2fwallpapercave.com%2fwp%2fwp1946050.jpg&ehk=s%2fbeqrs6stRqTs%2bO5MOpsePOb%2bQbXA2KyK8HwRy4jCw%3d&risl=&pid=ImgRaw&r=0",
            }}
            className="rounded-3xl"
            style={
              {
                // width: width * 0.3,
                // height: height * 0.2,
                // marginHorizontal: 10,
                // paddingHorizontal: 10,
              }
            }
          />

          <Text className=" text-neutral-300 ml-1 text-lg font-bold">
            {item.title.length > 12
              ? item.title.slice(0, 12) + "..."
              : item.title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View className="space-y-4 mb-4">
      <View className="mx-4 flex-row justify-between items-center">
        <Text className="text-black text-lg font-bold">Categories</Text>
      </View>
      <CategoryList />

      <FlatList
        horizontal
        data={data}
        renderItem={({ item }) => (
          <Card
            item={item}
            handleClick={handleClick}
            style={{
              width: width * 0.45,
              height: height * 0.2,
            }}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
      />
    </View>
  );
}
