import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";

// @ts-ignore
const FoodListItem = ({ item }) => {
  return (
    <View
      style={{
        backgroundColor: "gainsboro",
        padding: 10,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.label}</Text>
        <Text style={{ color: "dimgray" }}>
          {item.calories} cal, {item.brand}
        </Text>
      </View>
      <Feather name="plus-square" size={36} color="royalblue" />
    </View>
  );
};

export default FoodListItem;
