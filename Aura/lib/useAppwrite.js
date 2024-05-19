// fn is a parameter that will try to fetch somrthing
import { useState, useEffect } from "react";
import { Alert } from "react-native";
const useAppWrite = (fn) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fn();
      if (response) {
        setData(response);
      } else {
        throw Error;
      }
    } catch (e) {
      Alert.alert("Error", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, isLoading, refetch };
};

export default useAppWrite;
