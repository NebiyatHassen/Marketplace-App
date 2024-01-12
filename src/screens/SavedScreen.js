import {
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  Touchable,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { image500 } from "../../utils/moviesapi";
import Card from "../components/Card";
import colors from "../../config/colors";
const { width, height } = Dimensions.get("window");

export default function SavedScreen() {
  const navigation = useNavigation();

  const [savedMovies, setSavedMovies] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadSavedMovies = async () => {
        try {
          const savedMovies = await AsyncStorage.getItem("savedMovies");
          const savedMoviesArray = savedMovies ? JSON.parse(savedMovies) : [];
          setSavedMovies(savedMoviesArray);
        } catch (error) {
          console.log(error);
        }
      };
      loadSavedMovies();
    }, [navigation])
  );

  const clearSavedMovies = async () => {
    try {
      await AsyncStorage.removeItem("savedMovies");
      setSavedMovies([]);
      console.log("Clear all saved movies");
    } catch (error) {
      console.log("Error clearing saved movies", error);
    }
  };

  return (
    <ScrollView>
      <View className=" relative flex-1">
        <View className="mt-12 p-4">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-xl text-black ">
              Favorite Product
            </Text>
            <TouchableOpacity
              onPress={clearSavedMovies}
              className="bg-red-500 py-1 px-4 rounded-lg"
            >
              <Text className="font-bold text-lg text-white">Clear</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between flex-wrap">
            {savedMovies.map((movie, index) => (
              <View className="flex-row mt-4 " key={index}>
                <TouchableWithoutFeedback>
                  <View style={[styles.card]}>
                    <Image
                      source={{
                        uri: movie.image,
                      }}
                      style={[
                        {
                          width: width * 0.65,
                          height: height * 0.25,
                        },
                      ]}
                      resizeMode="contain"
                      className="rounded-2xl"
                    />
                    <View style={styles.detailContainer}>
                      <Text style={styles.title}>{movie.title}</Text>
                      <Text style={styles.subTitle}>{movie.price}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  card: {
    borderRadius: 25,
    backgroundColor: "#fff",
    marginBottom: 20,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  detailContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  title: {
    marginBottom: 7,
  },
  subTitle: {
    color: colors.secondary,
    fontWeight: "bold",
  },
});
