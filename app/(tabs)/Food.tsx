import React, { useState, useEffect } from "react";
import { ScrollView, SafeAreaView, Text, StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import FoodListItem from "@/components/FoodListItem";

const HomeScreen = () => {
  const [foodData, setFoodData] = useState({
    goalCalories: 2000,
    consumedCalories: 0,
    exerciseCalories: 200,
    meals: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    },
  });

  // Function to add food to breakfast
  const addFoodToBreakfast = (foodItem) => {
    setFoodData((prevData) => {
      const updatedBreakfast = [...prevData.meals.breakfast, foodItem];
      const updatedConsumedCalories =
        prevData.consumedCalories + (foodItem.foodNutrients[0]?.value || 0);

      return {
        ...prevData,
        consumedCalories: updatedConsumedCalories,
        meals: {
          ...prevData.meals,
          breakfast: updatedBreakfast,
        },
      };
    });
  };

  // Function to add food to lunch
  const addFoodToLunch = (foodItem) => {
    setFoodData((prevData) => {
      const updatedLunch = [...prevData.meals.lunch, foodItem];
      const updatedConsumedCalories =
        prevData.consumedCalories + (foodItem.foodNutrients[0]?.value || 0);

      return {
        ...prevData,
        consumedCalories: updatedConsumedCalories,
        meals: {
          ...prevData.meals,
          lunch: updatedLunch,
        },
      };
    });
  };

  // Function to add food to dinner
  const addFoodToDinner = (foodItem) => {
    setFoodData((prevData) => {
      const updatedDinner = [...prevData.meals.dinner, foodItem];
      const updatedConsumedCalories =
        prevData.consumedCalories + (foodItem.foodNutrients[0]?.value || 0);

      return {
        ...prevData,
        consumedCalories: updatedConsumedCalories,
        meals: {
          ...prevData.meals,
          dinner: updatedDinner,
        },
      };
    });
  };

  // Function to add food to snacks
  const addFoodToSnacks = (foodItem) => {
    setFoodData((prevData) => {
      const updatedSnacks = [...prevData.meals.snacks, foodItem];
      const updatedConsumedCalories =
        prevData.consumedCalories + (foodItem.foodNutrients[0]?.value || 0);

      return {
        ...prevData,
        consumedCalories: updatedConsumedCalories,
        meals: {
          ...prevData.meals,
          snacks: updatedSnacks,
        },
      };
    });
  };

  // Mock Data for testing
  useEffect(() => {
    const mockBreakfastItems = [
      {
        description: "Cafe Au Lait",
        brandName: "Nescafé",
        foodNutrients: [{ nutrientId: 1008, value: 40 }], // kcal data
      },
      {
        description: "Oatmeal",
        brandName: "Quaker",
        foodNutrients: [{ nutrientId: 1008, value: 150 }], // kcal data
      },
      {
        description: "Scrambled Eggs",
        brandName: "Generic",
        foodNutrients: [{ nutrientId: 1008, value: 200 }], // kcal data
      },
      {
        description: "Toast with Butter",
        brandName: "Generic",
        foodNutrients: [{ nutrientId: 1008, value: 180 }], // kcal data
      },
      {
        description: "Orange Juice",
        brandName: "Tropicana",
        foodNutrients: [{ nutrientId: 1008, value: 110 }], // kcal data
      },
    ];

    const mockLunchItems = [
      {
        description: "Chicken Salad",
        brandName: "Generic",
        foodNutrients: [{ nutrientId: 1008, value: 350 }], // kcal data
      },
      {
        description: "Greek Yogurt",
        brandName: "Chobani",
        foodNutrients: [{ nutrientId: 1008, value: 120 }], // kcal data
      },
    ];

    const mockDinnerItems = [
      {
        description: "Grilled Salmon",
        brandName: "Generic",
        foodNutrients: [{ nutrientId: 1008, value: 400 }], // kcal data
      },
      {
        description: "Steamed Vegetables",
        brandName: "Generic",
        foodNutrients: [{ nutrientId: 1008, value: 80 }], // kcal data
      },
    ];

    // Add items to breakfast
    mockBreakfastItems.forEach((item) => addFoodToBreakfast(item));

    // Add items to lunch
    mockLunchItems.forEach((item) => addFoodToLunch(item));

    // Add items to dinner
    mockDinnerItems.forEach((item) => addFoodToDinner(item));

    // Leave snacks empty
  }, []);

  // Calculate the remaining calories
  const remainingCalories =
    foodData.goalCalories -
    foodData.consumedCalories +
    foodData.exerciseCalories;

  const calculateMealCalories = (meal) =>
    meal.reduce((sum, food) => sum + (food.foodNutrients[0]?.value || 0), 0);

  const renderMeal = (mealName, mealData) => (
    <View style={styles.mealContainer}>
      <Text style={styles.mealTitle}>
        {mealName} - {calculateMealCalories(mealData)} kcal
      </Text>
      {mealData.map((item, index) => (
        <FoodListItem key={index} item={item} />
      ))}
      <Link href="/Search" style={styles.addFoodLink}>
        Add Food
      </Link>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      bounces={false} // Disable bounce effect on iOS
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.caloriesContainer}>
          <View style={styles.caloriesRow}>
            <Text style={styles.caloriesNumber}>{foodData.goalCalories}</Text>
            <Text style={styles.caloriesLabel}>Goal</Text>
          </View>
          <Text style={styles.symbol}>-</Text>
          <View style={styles.caloriesRow}>
            <Text style={styles.caloriesNumber}>
              {foodData.consumedCalories}
            </Text>
            <Text style={styles.caloriesLabel}>Food</Text>
          </View>
          <Text style={styles.symbol}>+</Text>
          <View style={styles.caloriesRow}>
            <Text style={styles.caloriesNumber}>
              {foodData.exerciseCalories}
            </Text>
            <Text style={styles.caloriesLabel}>Exercise</Text>
          </View>
          <Text style={styles.symbol}>=</Text>
          <View style={styles.caloriesRow}>
            <Text style={styles.remainingCalories}>{remainingCalories}</Text>
            <Text style={styles.caloriesLabel}>Remaining</Text>
          </View>
        </View>

        {renderMeal("Breakfast", foodData.meals.breakfast)}
        {renderMeal("Lunch", foodData.meals.lunch)}
        {renderMeal("Dinner", foodData.meals.dinner)}
        {renderMeal("Snacks", foodData.meals.snacks)}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: "#f9f9f9",
    padding: 15,
  },
  caloriesContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  caloriesRow: {
    alignItems: "center",
  },
  caloriesNumber: {
    fontSize: 20,
    fontWeight: "600",
  },
  caloriesLabel: {
    fontSize: 16,
    color: "#999",
  },
  remainingCalories: {
    color: "#1E90FF",
    fontWeight: "700",
    fontSize: 20,
  },
  symbol: {
    fontSize: 24,
    fontWeight: "600",
    marginHorizontal: 5,
  },
  mealContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  addFoodLink: {
    color: "#1E90FF",
    marginTop: 10,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default HomeScreen;
