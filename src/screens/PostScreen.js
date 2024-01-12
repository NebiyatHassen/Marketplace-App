import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Text,
  Image,
  TextInput,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../colors";
import { useDispatch } from "react-redux";
const ProductContext = createContext();

export const useProductContext = () => {
  return useContext(ProductContext);
};

const PostScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [userToken, setUserToken] = useState("");
  const [tokenFetched, setTokenFetched] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        console.log(token);
        setUserToken(token);
        if (userToken) {
          handlePost();
        }
        setTokenFetched(true);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    init();
  }, []);
  const handlePost = async () => {
    const url = "http://10.194.65.23:9000/api/v1/lists";
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("phoneNumber", phoneNumber);

    if (image) {
      const localUri = image;
      const filename = localUri.split("/").pop();

      formData.append("image", {
        uri: localUri,
        name: filename,
        type: "image/jpeg",
      });
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (response.ok) {
      setTitle("");
      setPrice("");
      setDescription("");
      setPhoneNumber("");
      setImage(null);
      navigation.navigate("Home");
    } else {
      console.error("Post failed:", response.status);
    }
  };
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.filedcontainer}>
          <Text style={styles.titleText}>Post Product</Text>
          <TouchableWithoutFeedback onPress={pickImage}>
            <View style={styles.containerFrom}>
              <View style={styles.container}>
                {!image && (
                  <MaterialCommunityIcons
                    name="camera"
                    size={50}
                    color={colors.medium}
                  />
                )}
                {image && (
                  <Image source={{ uri: image }} style={styles.image} />
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => setTitle(text)}
            placeholder="Enter title"
            placeholderTextColor="#ccc"
          />
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={(text) => setPrice(text)}
            placeholder="Enter price"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            placeholder="Enter phone number"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.descInput}
            value={description}
            onChangeText={(text) => setDescription(text)}
            placeholder="Enter description"
            placeholderTextColor="#ccc"
            multiline={true}
          />
          <TouchableOpacity style={styles.button} onPress={handlePost}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 10,
  },
  filedcontainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 20,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  descInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 30,
    marginBottom: 20,
    textAlignVertical: "top",
    paddingLeft: 5,
  },
  button: {
    backgroundColor: "#AAD9BB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
  },
  container: {
    borderRadius: 15,
    backgroundColor: colors.light,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
    overflow: "hidden",
  },

  containerFrom: {
    marginTop: 40,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
export default PostScreen;
