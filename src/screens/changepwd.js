import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert,StyleSheet } from 'react-native';
import { getAuth, reauthenticateWithCredential, updatePassword,EmailAuthProvider } from 'firebase/auth';

const ChangePasswordScreen = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
  
    const handleChangePassword = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
  
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
  
        await updatePassword(user, newPassword);
  
        Alert.alert('Success', 'Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
      } catch (error) {
        console.error('Error changing password:', error.message);
        Alert.alert('Error', 'Failed to change password. Please check your current password and try again.');
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#EAECCC'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      width: '80%',
      marginBottom: 20,
      padding: 10,
      borderRadius: 5,
    },
    button: {
      backgroundColor: '#607274',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  
  export default ChangePasswordScreen;
