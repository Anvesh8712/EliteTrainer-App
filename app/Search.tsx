import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  Text,
  Button,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import FoodListItem from "@/components/FoodListItem";
import { useState, useEffect } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import RecentMeals from "@/components/RecentMeals";

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

const mutation = gql`
  mutation AddFoodLog(
    $food_id: Int!
    $food_name: String!
    $kcal: Int!
    $meal_type: String!
    $user_id: Int!
    $day_eaten: Date!
  ) {
    insertFood_log(
      food_id: $food_id
      food_name: $food_name
      kcal: $kcal
      meal_type: $meal_type
      user_id: $user_id
      day_eaten: $day_eaten
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

const Search = () => {
  const [search, setSearch] = useState("");
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const router = useRouter();

  const user_id = 2;

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const { mealType, selectedDate } = useLocalSearchParams();

  const [runSearch, { data, loading, error }] = useLazyQuery(query);
  const [logFood] = useMutation(mutation, {
    refetchQueries: ["food_logByUser_idAndDay_eaten"],
  });

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

  const handleBarcodeScanned = async (scannedData: { data: any }) => {
    if (scannerEnabled) {
      // Disable the scanner to prevent multiple triggers
      setScannerEnabled(false);

      const barcode = scannedData.data;

      // Perform the GraphQL query using the barcode as the search string
      const { data, error } = await runSearch({
        variables: {
          query: barcode,
        },
      });

      if (error) {
        alert("Error querying the database. Please try again.");
        console.error("GraphQL error:", error);
        // Re-enable the scanner if there was an error
        setScannerEnabled(true);
        return;
      }

      const result = data?.search?.foods?.[0]; // Take the first item in the result array

      if (result) {
        // Find the kcal value from the foodNutrients
        const kcalNutrient = result.foodNutrients.find(
          (nutrient: { nutrientId: number }) => nutrient.nutrientId === 1008
        );

        if (kcalNutrient) {
          // If the food item exists and has kcal information, add it using the mutation
          await logFood({
            variables: {
              food_id: parseInt(result.fdcId, 10),
              food_name: result.description,
              kcal: kcalNutrient.value,
              meal_type: mealType,
              user_id: 2, // Replace with dynamic user ID if needed
              day_eaten: selectedDate, // Include the selected date
            },
          });
          router.back();
        } else {
          alert("Kcal information not available for this food item.");
        }
      } else {
        // If the food item doesn't exist, notify the user
        alert("Food item not available for barcode scanning.");
      }
    }
  };

  const performSearch = () => {
    runSearch({
      variables: {
        query: search,
      },
    });
  };

  if (scannerEnabled) {
    if (!permission) {
      // Camera permissions are still loading.
      return <View />;
    }

    if (!permission.granted) {
      // Camera permissions are not granted yet.
      return (
        <View style={styles.container}>
          <Text style={styles.message}>
            We need your permission to show the camera
          </Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
        <AntDesign
          name="closesquareo"
          size={24}
          color="black"
          style={{ position: "absolute", right: 15, top: 60 }}
          onPress={() => setScannerEnabled(false)}
        />
      </SafeAreaView>
    );
  }

  // [!!!] Keep only foods with nutrientId 1008 ->  kcal

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 20,
        }}
      >
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search..."
          style={styles.input}
        />
        <Ionicons
          name="barcode-sharp"
          size={32}
          color="dimgray"
          onPress={() => {
            setScannerEnabled(true);
          }}
        />
      </View>

      {search && <Button title="Search" onPress={performSearch} />}
      {loading && <ActivityIndicator />}
      {search && !loading && (
        <FlatList
          data={filteredFoods}
          renderItem={({ item }) => (
            <FoodListItem
              item={item}
              mealType={mealType}
              selectedDate={selectedDate}
              isHomeScreen={false}
              id={item.id}
            />
          )}
          ListEmptyComponent={() => <Text>Search for Something!</Text>}
          contentContainerStyle={{ gap: 5 }}
        ></FlatList>
      )}
      {!search && (
        <RecentMeals
          user_id={user_id}
          mealType={mealType}
          selectedDate={selectedDate}
        />
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
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
export default Search;
