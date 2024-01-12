import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Button,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
} from "react-native";
import colors from "../../config/colors";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseUrl = "http://10.194.65.23:9000/api/v1/lists/";

const ProductListingScreen = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedProductName, setEditedProductName] = useState("");
  const [editedProductPrice, seteditedProductPrice] = useState("");
  const [editedProductDescription, seteditedProductDescription] = useState("");
  const [editedPhoneNumber, seteditedPhoneNumber] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [products, setProducts] = useState([]);
  const [image, setImage] = useState(null);
  const [userToken, setUserToken] = useState("");
  const [tokenFetched, setTokenFetched] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        console.log(token);
        setUserToken(token);
        if (userToken) {
          fetchProducts();
        }
        setTokenFetched(true);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    init();
  }, [products, userToken]);

  const handleUpdate = async (product) => {
    const urlWithID = `${baseUrl}/${product.id}`;
    const formData = new FormData();
    formData.append("title", editedProductName);
    formData.append("price", editedProductPrice);
    formData.append("description", editedProductDescription);
    formData.append("phoneNumber", editedPhoneNumber);

    if (image) {
      const localUri = image;

      const filename = localUri.split("/").pop();
      formData.append("image", {
        uri: localUri,
        name: filename,
        type: "image/jpeg", // Modify the type if needed
      });
    }

    const response = await fetch(urlWithID, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });
    if (response.ok) {
    } else {
      // Handle error
      console.error("Post failed:", response.status);
      // Optionally, display an error message or handle the error in your UI
    }
  };
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

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    deleteProduct(selectedProduct.id);
    setDeleteModalVisible(false);
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedProduct(null);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditedProductName(product.title); // Assuming 'title' is the field you want to edit
    seteditedProductPrice(product.price); // Assuming 'title' is the field you want to edit
    seteditedProductDescription(product.description); // Assuming 'title' is the field you want to edit
    seteditedPhoneNumber(product.phoneNumber); // Assuming 'title' is the field you want to edit
    setEditModalVisible(true);
    setImage(product.image);
  };

  const saveEdit = () => {
    handleUpdate(selectedProduct);
    setEditModalVisible(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (tokenFetched) {
      fetchProducts();
    }
  }, [tokenFetched]);

  const fetchProducts = async () => {
    try {
      if (!userToken) {
        console.log("No Token");
        return;
      }
      const response = await fetch(
        "http://10.194.65.23:9000/api/v1/lists/myList",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const data = await response.json();
      const lData = data.data.productInfos.slice(0, 5);
      setProducts(lData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await fetch(`${baseUrl}${productId}`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginTop: 30, alignSelf: "center" }}>
        Product Listing
      </Text>

      <FlatList
        style={{ marginTop: 20 }}
        data={products}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: 70,
                height: 60,
                marginRight: 10,
                borderRadius: 6,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text>{item.title}</Text>
              <Text>{item.price}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item)}>
              <MaterialCommunityIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Ionicons name="pencil" size={21} color="green" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Delete Confirmation Modal */}
      <Modal visible={isDeleteModalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#F5F5F5",
              padding: 30,
              borderRadius: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}
            >
              Are you sure you want to delete this item?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <Button title="Delete" color="#E53935" onPress={confirmDelete} />
              <Button title="Cancel" color="green" onPress={cancelDelete} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Product Modal */}
      <Modal visible={isEditModalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              padding: 30,
              borderRadius: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              width: "90%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Edit Product
            </Text>
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
            <TextInput
              value={editedProductName}
              onChangeText={(text) => setEditedProductName(text)}
              placeholder="Edit Product name"
              style={{
                backgroundColor: "#F5F5F5",
                padding: 10,
                borderRadius: 8,
                marginBottom: 20,
              }}
            />
            <TextInput
              value={editedProductPrice.toString()}
              onChangeText={(text) => seteditedProductPrice(text)}
              placeholder="Edit Product price"
              keyboardType="numeric"
              style={{
                backgroundColor: "#F5F5F5",
                padding: 10,
                borderRadius: 8,
                marginBottom: 20,
              }}
            />
            <TextInput
              value={editedProductDescription}
              onChangeText={(text) => seteditedProductDescription(text)}
              placeholder="Edit Product Description"
              style={{
                backgroundColor: "#F5F5F5",
                padding: 10,
                borderRadius: 8,
                marginBottom: 20,
              }}
            />
            <TextInput
              value={editedPhoneNumber}
              onChangeText={(text) => seteditedPhoneNumber(text)}
              placeholder="Edit Phone Number"
              style={{
                backgroundColor: "#F5F5F5",
                padding: 10,
                borderRadius: 8,
                marginBottom: 20,
              }}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <View style={{ width: 80, height: 40 }}>
                <Button
                  title="Save"
                  color="green"
                  onPress={saveEdit}
                  style={{ flex: 1 }} // This might help to fill the container
                />
              </View>
              <View style={{ width: 80, height: 40 }}>
                <Button
                  title="Cancel"
                  color="#FF3B30"
                  onPress={() => setEditModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
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

export default ProductListingScreen;
