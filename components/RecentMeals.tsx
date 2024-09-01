import React, { useEffect } from "react";
import { FlatList, Text } from "react-native";
import { gql, useLazyQuery } from "@apollo/client";
import FoodListItem from "@/components/FoodListItem";

// Define the types for props
interface RecentMealsProps {
  user_id: number;
  mealType: string | string[];
  selectedDate: string | string[];
}

// Define the type for the GraphQL response
interface FoodLog {
  id: number;
  food_id: number;
  food_name: string;
  kcal: number;
  meal_type: string;
  day_eaten: string;
}

interface RecentMealsData {
  food_logByUser_idAndMeal_type: FoodLog[];
}

// Define the GraphQL query
const recentMealsQuery = gql`
  query GetRecentMeals($user_id: Int!, $meal_type: String!) {
    food_logByUser_idAndMeal_type(user_id: $user_id, meal_type: $meal_type) {
      id
      food_id
      food_name
      kcal
      meal_type
      day_eaten
    }
  }
`;

const RecentMeals: React.FC<RecentMealsProps> = ({
  user_id,
  mealType,
  selectedDate,
}) => {
  const [getRecentMeals, { data, loading, error }] =
    useLazyQuery<RecentMealsData>(recentMealsQuery);

  useEffect(() => {
    getRecentMeals({
      variables: {
        user_id: user_id, // Use the typed user_id
        meal_type: mealType,
      },
    });
  }, [mealType]);

  if (loading) {
    return null; // Or you can return an activity indicator
  }

  if (error) {
    return <Text>Error loading recent meals</Text>;
  }

  const mappedRecentMeals = data?.food_logByUser_idAndMeal_type?.map(
    (meal) => ({
      description: meal.food_name,
      foodNutrients: [{ value: meal.kcal }],
      brandName: "generic",
      fdcId: meal.food_id.toString(),
    })
  );

  return (
    <FlatList
      data={mappedRecentMeals}
      renderItem={({ item }) => (
        <FoodListItem
          item={item}
          mealType={mealType}
          selectedDate={selectedDate}
          isHomeScreen={false}
          id={item.fdcId}
        />
      )}
      ListEmptyComponent={() => (
        <Text>No recent meals available for {mealType}</Text>
      )}
      contentContainerStyle={{ gap: 5 }}
    />
  );
};

export default RecentMeals;
