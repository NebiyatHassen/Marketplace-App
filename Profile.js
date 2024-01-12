import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const [image, setImage] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");

  useEffect(() => {
    // Load saved data from local storage when the component mounts
    const loadSavedData = async () => {
      try {
        const savedImage = await AsyncStorage.getItem("profileImage");
        const savedMobileNumber = await AsyncStorage.getItem("mobileNumber");

        if (savedImage) {
          setImage(savedImage);
        }

        if (savedMobileNumber) {
          setMobileNumber(savedMobileNumber);
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
      // Access the selected assets through the "assets" array
      const selectedAsset = result.assets[0];

      // Save the selected image to local storage
      setImage(selectedAsset.uri);
      await AsyncStorage.setItem("profileImage", selectedAsset.uri);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // Update the mobile number in Firestore
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          mobileNumber: mobileNumber || userDoc.data().mobileNumber,
        });
      }

      // Update the profile image
      if (image) {
        await updateProfile(user, { photoURL: image });
      }

      // Save the updated data to local storage
      await AsyncStorage.setItem("mobileNumber", mobileNumber);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("An error occurred while updating the profile. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <Image
            source={require("../yeneSuq/assets/images/avatar.png")}
            style={styles.profileImage}
          />
        )}
        <Text style={styles.changePhotoText}>Change Photo</Text>
      </TouchableOpacity>

      {/* <TextInput
        placeholder="Mobile Number"
        onChangeText={setMobileNumber}
        value={mobileNumber}
        style={styles.input}
      /> */}

      <TouchableOpacity
        onPress={handleUpdateProfile}
        style={styles.updateButton}
      >
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imagePickerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changePhotoText: {
    color: "red",
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
