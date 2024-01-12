import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import axios from "axios";

const NewProductForm = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [image, setImage] = useState(null);

  const selectImage = () => {
    const options = {
      title: "Select Product Image",
      mediaType: "photo",
      maxWidth: 300,
      maxHeight: 300,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("Image picker cancelled");
      } else if (response.error) {
        console.error("Image picker error:", response.error);
      } else {
        setImage(response.uri);
      }
    });
  };

  const uploadProduct = async () => {
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("description", productDescription);
    formData.append("image", {
      uri: image,
      type: "image/jpeg",
      name: "product_image.jpg",
    });

    try {
      const response = await axios.post("YOUR_BACKEND_ENDPOINT", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Add any additional headers needed
        },
      });
      console.log("Product uploaded:", response.data);
      // Reset form fields and image after successful upload
      setProductName("");
      setProductPrice("");
      setProductDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error uploading product:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Product Name */}
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />

      {/* Product Price */}
      <TextInput
        style={styles.input}
        placeholder="Product Price"
        value={productPrice}
        onChangeText={setProductPrice}
        keyboardType="numeric"
      />

      {/* Product Description */}
      <TextInput
        style={styles.input}
        placeholder="Product Description"
        value={productDescription}
        onChangeText={setProductDescription}
        multiline
        numberOfLines={4}
      />

      {/* Image Picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.selectedImage} />
        ) : (
          <Text>Select Product Image</Text>
        )}
      </TouchableOpacity>

      {/* Upload Button */}
      <Button title="Upload Product" onPress={uploadProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    borderWidth: 1,
    borderStyle: "dashed",
    marginBottom: 20,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default NewProductForm;
