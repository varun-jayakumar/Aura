import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React from "react";
import { useState } from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";

const VideoCard = ({ item }) => {
  const [play, setPlay] = useState(false);
  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center flex items-center p-0.5 ">
            <Image
              source={{ uri: item.users.avatar }}
              className="h-full w-full rounded-lg"
              resize="cover"
            ></Image>
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {item.users.username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-full h-60 mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex jutify-center items-center"
        >
          <ImageBackground
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
            source={{ uri: item.thumbnail }}
          />
          <Image
            source={icons.play}
            className="w-12 h-12 mt-28 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
