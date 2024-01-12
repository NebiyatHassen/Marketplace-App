import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WelcomeScreen from "../screens/UserWelcomeScreen";
import SearchScreen from "../screens/SearchScreen";
import HomeScreen from "../screens/HomeScreen";
import Settingscreen from "../screens/SettingScreen";
import PersonScreen from "../screens/PersonScreen";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import ProductScreen from "../screens/productScreen";
import ChatRoomScreen from "../screens/chatScreen";
import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import PostScreen from "../screens/PostScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import chat from "../screens/chat";
import MyListingsScreen from "../screens/MyListing";
import NewListItem from "../components/NewListItem";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigation() {
  function HomeStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Welcome"
      >
        <Stack.Screen name="HomeTab" component={HomeTabs} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Movie" component={ProductScreen} />
        <Stack.Screen name="Person" component={PersonScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Splash" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Post" component={PostScreen} />
        <Stack.Screen name="MyList" component={MyListingsScreen} />
        <Stack.Screen name="chat" component={ChatRoomScreen} />
        <Stack.Screen name="inChat" component={chat} />
      </Stack.Navigator>
    );
  }

  function HomeTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ size, color, focused }) => (
              <MaterialCommunityIcons
                name="home"
                size={size}
                color={focused ? "#AAD9BB" : "black"}
              />
            ),
            tabBarLabelStyle: {
              color: "black",
            },
          }}
        />
        {/* <Tab.Screen
          name="Favorite"
          component={SavedScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ size, color, focused }) => (
              <MaterialCommunityIcons
                name="heart-outline"
                size={size}
                color={focused ? "#AAD9BB" : "black"}
              />
            ),
            tabBarLabelStyle: {
              color: "black",
            },
          }}
        /> */}

        <Tab.Screen
          name="My Listing"
          component={MyListingsScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ size, color, focused }) => (
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={size}
                color={focused ? "#AAD9BB" : "black"}
              />
            ),
            tabBarLabelStyle: {
              color: "black",
            },
          }}
        />
        <Tab.Screen
          name="Post"
          component={PostScreen}
          options={({ navigation, route }) => ({
            headerShown: false,
            tabBarButton: () => (
              <NewListItem onPress={() => navigation.navigate("Post")} />
            ),

            tabBarIcon: ({ size, color, focused }) => (
              <MaterialCommunityIcons
                name="plus-circle"
                size={size}
                color={focused ? "#AAD9BB" : "black"}
              />
            ),
            tabBarLabelStyle: {
              color: "black",
            },
          })}
        />
        <Tab.Screen
          name="Chat"
          component={ChatRoomScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons
                name="chatbox-outline"
                size={size}
                color={focused ? "#AAD9BB" : "black"}
              />
            ),
            tabBarLabelStyle: {
              color: "black",
            },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settingscreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ size, color, focused }) => (
              <AntDesign
                name="setting"
                size={size}
                color={focused ? "#AAD9BB" : "black"}
              />
            ),
            tabBarLabelStyle: {
              color: "black",
            },
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}
