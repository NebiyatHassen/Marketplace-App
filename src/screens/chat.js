import React, { useContext, useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
  Image,
  FlatList,
  Button,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatScreen = () => {
  const routes = useRoute();
  const { id: recipientId } = routes.params;
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");

  // ...

  useEffect(() => {
    console.log(recipientId);
    const fetchData = async () => {
      const userToken = await AsyncStorage.getItem("jwtToken");
      try {
        const response = await fetch(
          `http://10.194.65.23:9000/api/v1/getChat/${recipientId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }

        const chats = await response.json();
        console.log(chats);
        setChats(chats);

        return chats; // Corrected to return chats
      } catch (error) {
        console.error("Error fetching chats:", error);
        return [];
      }
    };
    recipientId && fetchData();
    const intervalId = setInterval(() => {
      recipientId && fetchData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [recipientId]);

  // ...

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const period = hours < 12 ? "AM" : "PM";

    return `${formattedHours}:${formattedMinutes} ${period}`;
  }

  const renderItem = ({ item }) => {
    return (
      <View style={{ paddingTop: 30 }}>
        <KeyboardAvoidingView>
          <Pressable
            style={
              item.senderId !== recipientId
                ? {
                    alignSelf: "flex-end",
                    backgroundColor: "#C8FAD6",
                    padding: 8,
                    maxWidth: "80%",
                    minWidth: "25%",
                    borderRadius: 7,
                    margin: 10,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    elevation: 1,
                  }
                : {
                    alignSelf: "flex-start",
                    backgroundColor: "#bbb",
                    padding: 8,
                    maxWidth: "80%",
                    minWidth: "25%",
                    borderRadius: 7,
                    margin: 10,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    elevation: 1,
                  }
            }
          >
            <Text style={{ fontSize: 20 }}>{item.chat}</Text>
            <Text style={{ alignSelf: "flex-end", marginTop: -2, fontSize: 9 }}>
              {formatTimestamp(10)}
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    );
  };
  const handlePress = async () => {
    const userId = recipientId;
    const userToken = await AsyncStorage.getItem("jwtToken");

    try {
      const postResponse = await fetch(
        `http://10.194.65.23:9000/api/v1/sendMessage/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            chat: message,
            recipientId: userId,
            chatType: "text",
          }),
        }
      );

      if (postResponse.ok) {
        setMessage("");
      } else {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ref={(ref) => {
          this.flastList = ref;
        }}
        onContentSizeChange={() => this.flastList.scrollToEnd()}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.myInputCard}>
        <TextInput
          placeholder="Enter Message"
          style={styles.myInput}
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <View style={styles.buttonContainer}>
          <Button title="Send" color="#000" onPress={handlePress} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "transparent",
    borderRadius: 15,
  },
  myInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  mypp: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  myHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  myInputCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    gap: 5,
  },
  emojiSelector: {
    height: 250,
  },
});
