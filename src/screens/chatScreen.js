import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const baseUrl = "http://10.194.65.23:9000/";

const ChatRoomScreen = ({ navigation }) => {
  const [chat, setChat] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCustomersForCurrentUser = async () => {
    setRefreshing(true);
    const userToken = await AsyncStorage.getItem("jwtToken");
    try {
      const response = await fetch(
        "http://10.194.65.23:9000/api/v1/chatList/getCustomers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const customers = await response.json();
      console.log(customers);
      setChat(customers.customers);

      console.log("Customers for the current user:", chat);
      return customers;
    } catch (error) {
      console.error("Error fetching customers:", error);
      return [];
    } finally {
      setRefreshing(false);
    }
  };

  const handleUserPress = (userId) => {
    navigation.navigate("inChat", { id: userId });
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => handleUserPress(item._id)}>
      <View style={styles.userContainer}>
        <Image
          style={styles.userImage}
          source={{
            uri:
              baseUrl + item.image ||
              "https://w7.pngwing.com/pngs/627/97/png-transparent-avatar-web-development-computer-network-avatar-game-web-design-heroes.png",
          }}
        />
        <View style={styles.details}>
          <Text style={styles.name}>{item.firstName}</Text>
          <Text style={styles.message}>{item.lastMessage.chat}</Text>
        </View>
        <Text style={styles.time}>Today</Text>
      </View>
    </Pressable>
  );

  const onRefresh = useCallback(() => {
    fetchCustomersForCurrentUser();
  }, []);

  useEffect(() => {
    // Fetch data when the component mounts
    fetchCustomersForCurrentUser();
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <>
      <View style={styles.container}>
        <Text
          style={{
            alignSelf: "center",
            paddingTop: 60,
            color: "black",
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          Chat List
        </Text>
        <FlatList
          data={chat}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContainer}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flatListContainer: {
    paddingHorizontal: 16,
    marginTop: 40,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  message: {
    fontSize: 14,
    color: "#888",
  },
  time: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#AAD9BB",
  },
});

export default ChatRoomScreen;
