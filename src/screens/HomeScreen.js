import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import TrendingMovies from "../components/TrendingProduct";
import { useQuery } from "@tanstack/react-query";
import {
  fetchGenres,
  fetchPopularMovie,
  fetchTopRatedMovie,
  fetchTrendingMovie,
  fetchUpComingMovie,
} from "../../utils/moviesapi";
import Loading from "../components/Loading";
import PopularMovie from "../components/PopularProduct";
import Modal from "react-native-modal";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [trending, SetTrending] = useState([]);
  const [topRated, SetTopRated] = useState([]);
  const [popular, SetPopular] = useState([]);
  const [upcoming, SetUpcoming] = useState([]);
  const [genre, SetGenres] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPopularRefreshing, setIsPopularRefreshing] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleNotification = () => {
    toggleModal();
  };

  const handleRefresh = () => {
    handleNewRefresh();
    handleListRefresh();
  };

  const handleNewRefresh = () => {
    setIsRefreshing(true);
    fetchTrendingMovie()
      .then((data) => {
        const sortedItems = data.data.productInfos.reverse();
        const firstFiveItems = sortedItems.slice(0, 5);
        SetTrending(firstFiveItems);
      })
      .catch((error) => {
        console.log("Error fetching trending Movies", error);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  const handleListRefresh = () => {
    setIsPopularRefreshing(true);
    fetchPopularMovie()
      .then((data) => {
        const sortedItems = data.data.productInfos.reverse();
        SetPopular(sortedItems);
      })
      .catch((error) => {
        console.log("Error fetching trending Movies", error);
      })
      .finally(() => {
        setIsPopularRefreshing(false);
      });
  };
  const { isLoading: isTopRatedLoading } = useQuery({
    queryKey: ["topratedMovies"],
    queryFn: fetchTopRatedMovie,
    onSuccess: (data) => {
      SetTopRated(data.results);
    },
    onError: (error) => {
      console.log("Error fetching Top Rated Movies", error);
    },
  });

  const { isLoading: isPopularLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchPopularMovie,
    onSuccess: (data) => {
      SetPopular(data.data.productInfos);
    },
    onError: (error) => {
      console.log("Error fetching Popular Movies", error);
    },
  });

  const { isLoading: isUpcomingLoading } = useQuery({
    queryKey: ["upcomingMovies"],
    queryFn: fetchUpComingMovie,
    onSuccess: (data) => {
      SetUpcoming(data.results);
    },
    onError: (error) => {
      console.log("Error fetching Popular Movies", error);
    },
  });

  const { isLoading: isGenresLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    onSuccess: (data) => {
      SetGenres(data.genres);
    },
    onError: (error) => {
      console.log("Error fetching Genre", error);
    },
  });
  const { isTrending, isTrendingLoading } = useQuery({
    queryKey: ["prductList"],
    queryFn: fetchTrendingMovie,
    onSuccess: (data) => {
      SetTrending(data.data.productInfos);
    },
    onError: (error) => {
      console.log("Error fetching Genre", error);
    },
  });

  return (
    <View className="flex-1" style={{ backgroundColor: "#F2F1EB" }}>
      <ScrollView
        className="mt-16"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <StatusBar style="light" />

        <View className="flex-row justify-between items-center mx-4 mg-4">
          <View className=" overflow-hidden">
            <Text style={{ color: "black", fontSize: 25 }}>Discover</Text>
          </View>

          <View className="flex-row space-x-4">
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <MagnifyingGlassIcon size={30} strokeWidth={2} color="black" />
            </TouchableOpacity>
          </View>

          <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <Text>Notification Content</Text>
                <TouchableOpacity onPress={toggleModal}>
                  <Text style={{ color: "blue", marginTop: 10 }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        {isTrendingLoading ? (
          <Loading />
        ) : (
          <>
            {trending?.length > 0 && <TrendingMovies data={trending} />}

            {popular?.length > 0 && (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={isPopularRefreshing}
                    onRefresh={handleListRefresh}
                  />
                }
              >
                <PopularMovie title="Popular" data={popular} />
              </ScrollView>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
