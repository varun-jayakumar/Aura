import { ScrollView, StyleSheet, Text, View, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLogged } = useGlobalContext;
  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Validation Error", "please fill in all the fields");
    }
    setIsSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);
      console.log(result);
      // set it to global state with context
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Sign Up to Aora
          </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(u) => setForm({ ...form, username: u })}
            otherStyles="mt-10"
          ></FormField>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-10"
            keyBoardType="email-address"
          ></FormField>

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(p) => setForm({ ...form, password: p })}
            otherStyles="mt-10`"
          ></FormField>

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
          ></CustomButton>
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 fron-pregular">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-lg font-psemibold text-secondary"
              >
                Sign In
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
