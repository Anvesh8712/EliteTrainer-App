import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  Text,
  Button,
  ActivityIndicator,
} from "react-native";
import React from "react";
import FoodListItem from "@/components/FoodListItem";
import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { useRouter, useLocalSearchParams } from "expo-router";

const query = gql`
  query MyQuery($query: String) {
    search(query: $query) {
      foods {
        fdcId
        brandName
        description
        servingSize
        servingSizeUnit
        foodNutrients {
          nutrientId
          nutrientName
          unitName
          value
        }
      }
    }
  }
`;

const Search = () => {
  const [search, setSearch] = useState("");

  const mealType = useLocalSearchParams();

  const [runSearch, { data, loading, error }] = useLazyQuery(query);

  const filteredFoods = data?.search?.foods
    ?.map((food: { foodNutrients: any[] }) => ({
      ...food,
      foodNutrients: food.foodNutrients.filter(
        (nutrient: { nutrientId: number }) => nutrient.nutrientId === 1008
      ),
    }))
    .filter(
      (food: { foodNutrients: string | any[] }) => food.foodNutrients.length > 0
    );

  if (error) {
    console.log("error", error);
    return <Text>Error</Text>;
  }

  // [!!!] Keep only foods with nutrientId 1008 ->  kcal

  const performSearch = () => {
    runSearch({
      variables: {
        query: search,
      },
    });
    // setSearch("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Add Food</Text>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search..."
        style={styles.input}
      />
      {search && <Button title="Search" onPress={performSearch} />}
      {loading && <ActivityIndicator />}
      {!loading && (
        <FlatList
          data={filteredFoods}
          renderItem={({ item }) => (
            <FoodListItem
              item={item}
              mealType={mealType}
              isHomeScreen={false}
            />
          )}
          ListEmptyComponent={() => <Text>Search for Something!</Text>}
          contentContainerStyle={{ gap: 5 }}
        ></FlatList>
      )}
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
export default Search;
