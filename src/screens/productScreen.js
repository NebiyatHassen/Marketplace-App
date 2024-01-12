import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Linking } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { fetchMovieDetails } from "../../utils/moviesapi";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import Loading from "../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

var { width, height } = Dimensions.get("window");

export default function MovieScreen() {
  const {
    params: { item },
  } = useRoute();
  const navigation = useNavigation();
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFavorite, toggleFavourite] = useState(false);
  const [chat, setChat] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Fetch data only if the item.id has changed
      if (item.id) {
        await getMovieDetails(item.id);
      }
      setLoading(false);
    };

    loadData();
  }, [item.id]);

  const getMovieDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    setLoading(false);
    if (data) {
      setMovie(data.list);
    }
  };

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const toggleFavouriteAndSave = async () => {
    try {
      const savedMovies = await AsyncStorage.getItem("savedMovies");
      let savedMoviesArray = savedMovies ? JSON.parse(savedMovies) : [];
      console.log("Check if the movie is already saved");

      const isMovieSaved = savedMoviesArray.some(
        (savedMovie) => savedMovie.id === item.id
      );

      console.log("Check if the movie is already in the saved list");

      if (!isMovieSaved) {
        savedMoviesArray.push(movie);
        await AsyncStorage.setItem(
          "savedMovies",
          JSON.stringify(savedMoviesArray)
        );
        toggleFavourite(true);
        console.log("Movie is added to the list of saved movies");
      } else {
        // If movie is already saved, remove it from the list
        const updatedSavedMoviesArray = savedMoviesArray.filter(
          (savedMovie) => savedMovie.id !== item.id
        );
        await AsyncStorage.setItem(
          "savedMovies",
          JSON.stringify(updatedSavedMoviesArray)
        );
        toggleFavourite(false);
        console.log("Movie is removed from the list of saved movies");
      }
    } catch (error) {
      console.log("Error Saving Movie", error);
    }
  };

  useEffect(() => {
    // Load savd movies from AsyncStorage when the component mounts
    const loadSavedMovies = async () => {
      try {
        const savedMovies = await AsyncStorage.getItem("savedMovies");
        const savedMoviesArray = savedMovies ? JSON.parse(savedMovies) : [];

        // Check if the movie is already in the saved list
        const isMovieSaved = savedMoviesArray.some(
          (savedMovie) => savedMovie.id === item.id
        );

        toggleFavourite(isMovieSaved);
        console.log("Check if the current movie is in the saved list");
      } catch (error) {
        console.log("Error Loading Saved Movies", error);
      }
    };

    loadSavedMovies();
  }, [item.id]);

  const handleNotification = async () => {
    const userId = movie.user_id;
    const userToken = await AsyncStorage.getItem("jwtToken");

    try {
      const postResponse = await fetch(
        `http://10.194.65.23:9000/api/v1/sendNotification/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            chat: chat,
            recipientId: userId,
            chatType: "text",
          }),
        }
      );

      if (postResponse.ok) {
        console.log("Notification sent successfully!");
      } else {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 20,
      }}
      className="flex-1 ng-neutral-900"
    >
      {/* Back Button and Movie Poster */}
      <View className="w-full">
        {/* Back and Heart Icon */}
        <View className="z-20 w-full flex-row justify-between items-center px-4 mt-12 absolute">
          {/* Back Icon */}
          <View className="bg-[#AAD9BB] p-2 rounded-full items-center justify-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeftIcon size={30} strokeWidth={2} color="white" />
            </TouchableOpacity>
          </View>

          {/* Heart Icon */}
          <View className="bg-[#AAD9BB] p-2 rounded-full items-center justify-center">
            <TouchableOpacity onPress={toggleFavouriteAndSave}>
              <HeartIcon
                size={30}
                strokeWidth={2}
                color={isFavorite ? "red" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Movie Image */}
        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              source={{
                uri: movie?.image,
              }}
              style={{
                width,
                height: height * 0.55,
              }}
            />
          </View>
        )}
      </View>

      {/* Movie Details */}
      <View className="space-y-3 flex-1 bg-white relative py-4 mt-[-98] overflow-hidden">
        <Image
          source={require("../../assets/images/gray.jpg")}
          style={{
            width,
            height,
          }}
          resizeMode="cover"
          className="absolute top-0 left-0"
        />

        {/* Movie Title */}

        <View className="space-y-3 p-4">
          <Text className="text-black text-left text-2xl font-bold tracking-widest">
            {movie?.title}
          </Text>

          {/* Description */}
          <Text className="text-black text-sm tracking-widest leading-6">
            {movie?.description}
          </Text>
        </View>
      </View>
      {/* Seller Information */}
      <View style={styles.sellerInfo}>
        {/* Seller Contact */}
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${movie.phoneNumber}`)}
        >
          <Text style={styles.sellerContact}>Contact Seller:</Text>
          <View style={styles.contactContainer}>
            <FontAwesome
              name="phone"
              size={25}
              color="black"
              style={{ marginRight: 7 }}
            />
            <Text
              style={{
                color: "#AAD9BB",
                fontWeight: "bold",
                fontSize: 15,
                marginLeft: 10,
              }}
            >
              {movie.phoneNumber}
            </Text>
          </View>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={chat}
          onChangeText={(text) => setChat(text)}
          placeholder="Text Seller"
        />
        <TouchableOpacity onPress={handleNotification}>
          <View style={styles.chatButton}>
            <View style={styles.chatButtonContent}>
              <Text style={styles.chatButtonText}>Contact Seller</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Existing styles...
  chatButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sellerInfo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
    borderRadius: 8,
  },
  sellerContact: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  chatButton: {
    backgroundColor: "#AAD9BB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  chatButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});
