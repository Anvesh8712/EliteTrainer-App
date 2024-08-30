// import React, { useState, useEffect } from "react";
// import { ScrollView, SafeAreaView, Text, StyleSheet, View } from "react-native";
// import { Link } from "expo-router";
// import FoodListItem from "@/components/FoodListItem";
// import { gql, useQuery } from "@apollo/client";

// const query = gql`
//   query food_logByUser_idAndDay_eaten($user_id: Int!, $day_eaten: Date!) {
//     food_logByUser_idAndDay_eaten(user_id: $user_id, day_eaten: $day_eaten) {
//       food_id
//       food_name
//       kcal
//       meal_type
//       day_eaten
//     }
//   }
// `;

// interface Meals {
//   breakfast: any[];
//   lunch: any[];
//   dinner: any[];
//   snack: any[];
// }

// interface FoodData {
//   goalCalories: number;
//   consumedCalories: number;
//   exerciseCalories: number;
//   meals: Meals;
// }

// const isMealType = (type: string): type is keyof Meals => {
//   return ["breakfast", "lunch", "dinner", "snack"].includes(type);
// };

// const HomeScreen = () => {
//   const [foodData, setFoodData] = useState<FoodData>({
//     goalCalories: 2000,
//     consumedCalories: 0,
//     exerciseCalories: 200,
//     meals: {
//       breakfast: [],
//       lunch: [],
//       dinner: [],
//       snack: [],
//     },
//   });

//   const user_id = 3; // Replace with dynamic user ID if needed
//   const day_eaten = new Date().toISOString().slice(0, 10);

//   const { loading, error, data } = useQuery(query, {
//     variables: { user_id, day_eaten },
//   });

//   useEffect(() => {
//     if (data) {
//       const meals: Meals = {
//         breakfast: [],
//         lunch: [],
//         dinner: [],
//         snack: [],
//       };
//       let totalCalories = 0;

//       data.food_logByUser_idAndDay_eaten.forEach(
//         (item: { meal_type: string; kcal: number; food_name: any }) => {
//           const mealType = item.meal_type.toLowerCase();

//           if (isMealType(mealType)) {
//             meals[mealType].push({
//               foodNutrients: [{ value: item.kcal }],
//               description: item.food_name,
//             });
//             totalCalories += item.kcal;
//           }
//         }
//       );

//       setFoodData((prevData) => ({
//         ...prevData,
//         consumedCalories: totalCalories,
//         meals: meals,
//       }));
//     }
//   }, [data]);

//   // Calculate the remaining calories
//   const remainingCalories =
//     foodData.goalCalories -
//     foodData.consumedCalories +
//     foodData.exerciseCalories;

//   const calculateMealCalories = (meal: any[]) =>
//     meal.reduce(
//       (sum: any, food: { foodNutrients: { value: any }[] }) =>
//         sum + (food.foodNutrients[0]?.value || 0),
//       0
//     );

//   const renderMeal = (
//     mealName:
//       | string
//       | number
//       | boolean
//       | React.ReactElement<any, string | React.JSXElementConstructor<any>>
//       | Iterable<React.ReactNode>
//       | null
//       | undefined,
//     mealData: any[],
//     mealType: string
//   ) => (
//     <View style={styles.mealContainer}>
//       <Text style={styles.mealTitle}>
//         {mealName} - {calculateMealCalories(mealData)} kcal
//       </Text>
//       {mealData.map((item: any, index: React.Key | null | undefined) => (
//         <FoodListItem key={index} item={item} />
//       ))}
//       <Link
//         href={{ pathname: "/Search", params: { mealType } }}
//         style={styles.addFoodLink}
//       >
//         Add Food
//       </Link>
//     </View>
//   );

//   return (
//     <ScrollView
//       contentContainerStyle={styles.scrollContainer}
//       bounces={false} // Disable bounce effect on iOS
//     >
//       <SafeAreaView style={styles.container}>
//         <View style={styles.caloriesContainer}>
//           <View style={styles.caloriesRow}>
//             <Text style={styles.caloriesNumber}>{foodData.goalCalories}</Text>
//             <Text style={styles.caloriesLabel}>Goal</Text>
//           </View>
//           <Text style={styles.symbol}>-</Text>
//           <View style={styles.caloriesRow}>
//             <Text style={styles.caloriesNumber}>
//               {foodData.consumedCalories}
//             </Text>
//             <Text style={styles.caloriesLabel}>Food</Text>
//           </View>
//           <Text style={styles.symbol}>+</Text>
//           <View style={styles.caloriesRow}>
//             <Text style={styles.caloriesNumber}>
//               {foodData.exerciseCalories}
//             </Text>
//             <Text style={styles.caloriesLabel}>Exercise</Text>
//           </View>
//           <Text style={styles.symbol}>=</Text>
//           <View style={styles.caloriesRow}>
//             <Text style={styles.remainingCalories}>{remainingCalories}</Text>
//             <Text style={styles.caloriesLabel}>Remaining</Text>
//           </View>
//         </View>

//         {renderMeal("Breakfast", foodData.meals.breakfast, "breakfast")}
//         {renderMeal("Lunch", foodData.meals.lunch, "lunch")}
//         {renderMeal("Dinner", foodData.meals.dinner, "dinner")}
//         {renderMeal("Snack", foodData.meals.snack, "snack")}
//       </SafeAreaView>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: "space-between", // Ensure content is distributed over the screen
//     minHeight: "100%", // Ensures it takes the full height
//   },
//   container: {
//     backgroundColor: "#f9f9f9",
//     padding: 15,
//     flex: 1, // Ensure it grows to fill the available space
//   },
//   caloriesContainer: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 10,
//     marginBottom: 20,
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//   },
//   caloriesRow: {
//     alignItems: "center",
//   },
//   caloriesNumber: {
//     fontSize: 20,
//     fontWeight: "600",
//   },
//   caloriesLabel: {
//     fontSize: 16,
//     color: "#999",
//   },
//   remainingCalories: {
//     color: "#1E90FF",
//     fontWeight: "700",
//     fontSize: 20,
//   },
//   symbol: {
//     fontSize: 24,
//     fontWeight: "600",
//     marginHorizontal: 5,
//   },
//   mealContainer: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   mealTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 10,
//   },
//   addFoodLink: {
//     color: "#1E90FF",
//     marginTop: 10,
//     fontSize: 16,
//     textDecorationLine: "underline",
//   },
// });

// export default HomeScreen;

import React, { useState, useEffect } from "react";
import {
  ScrollView,
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import FoodListItem from "@/components/FoodListItem";
import { gql, useQuery } from "@apollo/client";
import AntDesign from "@expo/vector-icons/AntDesign";

const query = gql`
  query food_logByUser_idAndDay_eaten($user_id: Int!, $day_eaten: Date!) {
    food_logByUser_idAndDay_eaten(user_id: $user_id, day_eaten: $day_eaten) {
      id
      food_id
      food_name
      kcal
      meal_type
      day_eaten
    }
  }
`;

interface Meals {
  breakfast: any[];
  lunch: any[];
  dinner: any[];
  snack: any[];
}

interface FoodData {
  goalCalories: number;
  consumedCalories: number;
  exerciseCalories: number;
  meals: Meals;
}

const isMealType = (type: string): type is keyof Meals => {
  return ["breakfast", "lunch", "dinner", "snack"].includes(type);
};

const HomeScreen = () => {
  const [foodData, setFoodData] = useState<FoodData>({
    goalCalories: 2000,
    consumedCalories: 0,
    exerciseCalories: 200,
    meals: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    },
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  const user_id = 2; // Replace with dynamic user ID if needed
  const day_eaten = selectedDate.toISOString().slice(0, 10);

  const { loading, error, data, refetch } = useQuery(query, {
    variables: { user_id, day_eaten },
  });

  useEffect(() => {
    if (data) {
      const meals: Meals = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
      };
      let totalCalories = 0;

      data.food_logByUser_idAndDay_eaten.forEach(
        (item: {
          meal_type: string;
          kcal: number;
          food_name: any;
          id: number;
        }) => {
          const mealType = item.meal_type.toLowerCase();

          if (isMealType(mealType)) {
            meals[mealType].push({
              foodNutrients: [{ value: item.kcal }],
              description: item.food_name,
              id: item.id,
            });
            totalCalories += item.kcal;
          }
        }
      );

      setFoodData((prevData) => ({
        ...prevData,
        consumedCalories: totalCalories,
        meals: meals,
      }));
    }
  }, [data]);

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
    refetch({ user_id, day_eaten: newDate.toISOString().slice(0, 10) });
  };

  // Calculate the remaining calories
  const remainingCalories =
    foodData.goalCalories -
    foodData.consumedCalories +
    foodData.exerciseCalories;

  const calculateMealCalories = (meal: any[]) =>
    meal.reduce(
      (sum: any, food: { foodNutrients: { value: any }[] }) =>
        sum + (food.foodNutrients[0]?.value || 0),
      0
    );

  const renderMeal = (
    mealName:
      | string
      | number
      | boolean
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | Iterable<React.ReactNode>
      | null
      | undefined,
    mealData: any[],
    mealType: string
  ) => (
    <View style={styles.mealContainer}>
      <Text style={styles.mealTitle}>
        {mealName} - {calculateMealCalories(mealData)} kcal
      </Text>
      {mealData.map((item: any, index: React.Key | null | undefined) => (
        <FoodListItem
          key={index}
          item={item}
          mealType={mealType}
          isHomeScreen={true}
          selectedDate={selectedDate.toISOString().slice(0, 10)}
          id={item.id}
        />
      ))}

      <Link
        href={{
          pathname: "/Search",
          params: {
            mealType,
            selectedDate: selectedDate.toISOString().slice(0, 10),
          },
        }}
        style={styles.addFoodLink}
      >
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
        <View style={styles.datePickerContainer}>
          <TouchableOpacity onPress={() => handleDateChange(-1)}>
            <AntDesign name="caretleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.selectedDateText}>
            {selectedDate.toDateString()}
          </Text>
          <TouchableOpacity onPress={() => handleDateChange(1)}>
            <AntDesign name="caretright" size={24} color="black" />
          </TouchableOpacity>
        </View>

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

        {renderMeal("Breakfast", foodData.meals.breakfast, "breakfast")}
        {renderMeal("Lunch", foodData.meals.lunch, "lunch")}
        {renderMeal("Dinner", foodData.meals.dinner, "dinner")}
        {renderMeal("Snack", foodData.meals.snack, "snack")}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between", // Ensure content is distributed over the screen
    minHeight: "100%", // Ensures it takes the full height
  },
  container: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    flex: 1, // Ensure it grows to fill the available space
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff", // Ensures it stands out against the grey background
    padding: 10,
    borderRadius: 10,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black", // Makes the text more readable
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
