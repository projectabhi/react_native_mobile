import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import CameraScreen from "./components/CameraScreen";
import GalleryScreen from "./components/GalleryScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === "Camera") {
              iconName = focused ? "camera" : "camera-outline";
            } else if (route.name === "Gallery") {
              iconName = focused ? "images" : "images-outline";
            } else {
              iconName = "help-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#1abc9c",
          tabBarInactiveTintColor: "gray",
          headerStyle: {
            backgroundColor: "#1abc9c",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        })}
      >
        <Tab.Screen
          name="Camera"
          component={CameraScreen}
          options={
            {
              title: "Record Video",
              unmountOnBlur: true,
            } as any
          }
        />
        <Tab.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{
            title: "Recorded Videos",
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
