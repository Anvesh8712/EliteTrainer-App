import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  Text,
  Button,
} from "react-native";
import React from "react";
import FoodListItem from "@/components/FoodListItem";
import { useState } from "react";

const foodItems = [
  { label: "Apple", calories: "50", brand: "generic" },
  { label: "banana", calories: "20", brand: "generic" },
  { label: "Pizza", calories: "75", brand: "Dominoes" },
  { label: "Coffee", calories: "75", brand: "Starbucks" },
];

const dashboard = () => {
  const [search, setSearch] = useState("");

  const performSearch = () => {
    console.warn("searching for items!!!");
    setSearch("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search..."
        style={styles.input}
      />
      {search && <Button title="Search" onPress={performSearch} />}

      <FlatList
        data={foodItems}
        renderItem={({ item }) => <FoodListItem item={item} />}
        contentContainerStyle={{ gap: 5 }}
      ></FlatList>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 10,
    gap: 10,
  },

  input: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 20,
  },
});
export default dashboard;
