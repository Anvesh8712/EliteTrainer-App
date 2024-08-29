import { View, Text, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "expo-router";

const mutation = gql`
  mutation AddFoodLog(
    $food_id: Int!
    $food_name: String!
    $kcal: Int!
    $meal_type: String!
    $user_id: Int!
  ) {
    insertFood_log(
      food_id: $food_id
      food_name: $food_name
      kcal: $kcal
      meal_type: $meal_type
      user_id: $user_id
    ) {
      created_at
      day_eaten
      food_id
      food_name
      id
      kcal
      meal_type
      user_id
    }
  }
`;

// @ts-ignore
const FoodListItem = ({ item }) => {
  const [logFood, { data, loading, error }] = useMutation(mutation, {
    refetchQueries: ["food_logByUser_idAndDay_eaten"],
  });
  const router = useRouter();

  const onPlusPresses = () => {
    console.log({
      food_id: parseInt(item.fdcId, 10), // or item.foodNutrients[0].food_id, if food_id is part of the nutrient data
      food_name: item.description,
      kcal: item.foodNutrients[0].value,
      meal_type: "breakfast", // Ensure you pass this as a prop to specify the meal type
      user_id: 3, // Ensure you pass this as a prop to specify the user
    });

    logFood({
      variables: {
        food_id: parseInt(item.fdcId, 10), // or item.foodNutrients[0].food_id, if food_id is part of the nutrient data
        food_name: item.description,
        kcal: item.foodNutrients[0].value,
        meal_type: "breakfast", // Ensure you pass this as a prop to specify the meal type
        user_id: 3, // Ensure you pass this as a prop to specify the user
      },
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          {item.description}
        </Text>
        <Text style={{ color: "dimgray" }}>
          {item.foodNutrients[0].value} cal, {item.brandName || "generic"}
        </Text>
      </View>
      <Feather
        name="plus-square"
        size={33}
        color="royalblue"
        onPress={onPlusPresses}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f6f8",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default FoodListItem;
