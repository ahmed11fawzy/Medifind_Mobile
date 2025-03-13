// components/BottomTabBar.js
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";

export const BottomTabBar = ({ navigation }) => {
  const route = useRoute();

  // تحديد الصفحة النشطة
  const getActiveState = (routeName) => {
    return route.name === routeName ? "#00bcd4" : "#333";
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.navigate("Home")}
        style={styles.tabButton}
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={getActiveState("Home")} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => navigation.navigate("AddMedicine")}
        style={styles.centerButton}
      >
        <View style={styles.circle}>
          <Ionicons 
            name="add" 
            size={32} 
            color={getActiveState("AddMedicine") ? "white" : "white"}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        style={styles.tabButton}
      >
        <Ionicons 
          name="menu" 
          size={24} 
          color="#333" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  centerButton: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    backgroundColor: "#00bcd4",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
