import { View, Text, StyleSheet } from "react-native";
import React from "react";
import FoodListItem from "@/components/FoodListItem";

const dashboard = () => {
  return (
    <View style={styles.container}>
      <FoodListItem
        item={{ label: "Pizza", calories: "75", brand: "Dominoes" }}
      />
      <FoodListItem
        item={{ label: "Apple", calories: "50", brand: "generic" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#646161",
    justifyContent: "center",
    padding: 10,
    gap: 5,
  },
});
export default dashboard;
