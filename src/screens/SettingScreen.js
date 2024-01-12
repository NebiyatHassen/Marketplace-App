import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput, // Import TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getAuth,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
const baseUrl = "http://10.194.65.23:9000/";

import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingScreen = ({ navigation }) => {
  const [theme, setTheme] = useState("light"); //
  const [notificationSwitch, setNotificationSwitch] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [about, setabout] = useState(false);

  const [userData, setUserData] = useState({
    name: "Melkamu",
    email: "melkamuabrarawdev@gmail.com",
  });

  const [editedUserData, setEditedUserData] = useState({
    name: userData.name,
    email: userData.email,
  });
  const handleEditProfile = () => {
    setEditedUserData({
      name: userData.name,
      email: userData.email,
    });
    toggleModal();
  };

  const handleSaveProfile = () => {
    setUserData({
      name: editedUserData.name,
      email: editedUserData.email,
    });
    updateProfileOnServer();
    toggleModal();
  };

  const updateProfileOnServer = async () => {
    try {
      const apiUrl = "http://10.194.65.23:9000/api/v1/users/profile";
      const token = await AsyncStorage.getItem("jwtToken");

      const formData = new FormData();
      formData.append("firstName", editedUserData.name);
      formData.append("email", editedUserData.email);

      if (image) {
        const filename = image.split("/").pop();

        formData.append("image", {
          uri: image,
          name: filename,
          type: "image/jpeg",
        });
      }

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));

        toggleModal();
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("An error occurred while updating the profile. Please try again.");
    }
  };

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  const [image, setImage] = useState(null);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("userData");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUserData({
            name: parsedUser.firstName,
            email: parsedUser.email,
          });
          setImage(baseUrl + parsedUser.image);
        }
      } catch (error) {
        console.error("Error loading saved data:", error.message);
      }
    };

    loadSavedData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];

      setImage(selectedAsset.uri);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (image) {
        await updateProfile(user, { photoURL: image });
      }
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("An error occurred while updating the profile. Please try again.");
    }
  };

  const handleNotificationToggle = () => {
    setNotificationSwitch(!notificationSwitch);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const modal = () => {
    setabout(!about);
  };
  const handleabout = () => {
    modal();
  };
  const handleNotification = () => {
    toggleModal();
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("jwtToken");
      await AsyncStorage.removeItem("userData");

      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };
  const handlePress = () => {};
  const handleChangePassword = () => {
    navigation.navigate("changepwd");
  };
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "#fff" : "#333" },
      ]}
    >
      <Text style={styles.head}>Settings</Text>
      <Text style={styles.header}>User Profile</Text>

      <View>
        <TouchableOpacity
          onPress={pickImage}
          style={styles.imagePickerContainer}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <Image
              source={require("../../assets/images/avatar.png")}
              style={styles.profileImage}
            />
          )}
        </TouchableOpacity>
        <View style={styles.imagePickerContainer}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            {userData.name}
          </Text>
          <Text>{userData.email}</Text>
          <TouchableOpacity
            onPress={handleEditProfile}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Ionicons name="pencil-outline" size={15} color="green" />
            <Text style={{ marginLeft: 8 }}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Modal isVisible={isModalVisible} style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: image || "https://via.placeholder.com/150" }} // Use the current user image or a placeholder
                style={styles.modalImage}
              />
              <TouchableOpacity
                onPress={pickImage}
                style={styles.changeImageButton}
              >
                <Text style={styles.changeImageButtonText}>Change Image</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editedUserData.name}
              onChangeText={(text) =>
                setEditedUserData({ ...editedUserData, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editedUserData.email}
              onChangeText={(text) =>
                setEditedUserData({ ...editedUserData, email: text })
              }
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      <Text style={styles.header}>User Preferences</Text>

      <TouchableOpacity style={styles.settingItem}>
        <Text>Language</Text>
        <Ionicons name="language-outline" size={24} color="#3498db" />
      </TouchableOpacity>

      <View style={styles.settingItem}>
        <Text>Dark Theme</Text>
        <Switch value={theme === "dark"} onValueChange={handleThemeToggle} />
      </View>

      <View style={styles.settingItem}>
        <Text>Enable Notifications</Text>
        <Switch
          value={notificationSwitch}
          onValueChange={handleNotificationToggle}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    borderColor: "black",
    marginBottom: 20,
    marginTop: 15,
  },
  head: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    padding: 14,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changeImageButton: {
    backgroundColor: "#AAD9BB",
    padding: 10,
    borderRadius: 5,
  },
  changeImageButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#AAD9BB",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },

  logoutButton: {
    backgroundColor: "#AAD9BB",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  containerr: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerContainer: {
    alignItems: "center",
    marginBottom: 2,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 75,
    marginBottom: 10,
    borderColor: "black",
  },
});

export default SettingScreen;
