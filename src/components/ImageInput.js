import React, { useEffect } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import colors from "../colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ImageInput = ({ uri, onChangeImage }) => {
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted)
      alert("You need to enable permission for accessing the files");
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      if (!result.canceled) onChangeImage(result.assets[0].uri); // Change 'cancelled' to 'canceled'
    } catch (error) {
      console.log("Error Reading Image Library");
    }
  };

  const handlePress = () => {
    if (!uri) selectImage();
    else
      Alert.alert("Delete", "Are You Sure You Want To Delete This Image?", [
        { text: "Yes", onPress: () => onChangeImage(null) },
        { text: "No" },
      ]);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {!uri && (
          <MaterialCommunityIcons
            name="camera"
            size={50}
            color={colors.medium}
          />
        )}
        {uri && <Image source={{ uri: uri }} style={styles.image} />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ImageInput;

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    backgroundColor: colors.light,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
