import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import React from "react";
import FoodListItem from "@/components/FoodListItem";

const foodItems = [
  { label: "Apple", calories: "50", brand: "generic" },
  { label: "banana", calories: "20", brand: "generic" },
  { label: "Pizza", calories: "75", brand: "Dominoes" },
  { label: "Coffee", calories: "75", brand: "Starbucks" },
];

const dashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
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
    backgroundColor: "#646161",
    padding: 10,
  },
});
export default dashboard;
