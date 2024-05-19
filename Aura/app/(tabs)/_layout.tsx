import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused}
                color={color}
                icon={icons.home}
                name={"Home"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused}
                color={color}
                icon={icons.plus}
                name={"Create"}
              />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="bookmark"
          options={{
            title: "",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused}
                color={color}
                icon={icons.bookmark}
                name={"Bookmark"}
              />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused}
                color={color}
                icon={icons.profile}
                name={"Profile"}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({});
