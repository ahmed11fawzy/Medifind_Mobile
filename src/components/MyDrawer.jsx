// import React, { useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   Image,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons"; // Make sure to install this:  `expo install @expo/vector-icons`
// import { useAuth } from "../hooks/useAuth";
// import { useGetUserByIdQuery } from "../redux/Slice/user";

// export const DrawerContent = (props) => {
//   const { user, userName, userId } = useAuth();
  
//   const { data: userData, isLoading: isLoadingUser, error: userError, refetch: refetchUser } = useGetUserByIdQuery(userId);
//   console.log('User Data in Drawer:', userData);
//   console.log('User Name:', userData?.name);
//   console.log('User Email:', userData?.email);
//   console.log('User Profile Image:', userData?.profileImage);
  
//   useEffect(() => {
//     if (userData) {
//       console.log('User Data in Drawer:', userData);
//       const user = Array.isArray(userData) ? userData[0] : userData;
//       console.log('User Name:', userData?.name);
//       console.log('User Email:', userData?.email);
//       console.log('User Profile Image:', userData?.profileImage);
//     }
//   }, [userData]);

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Top Profile Section */}
//       <View style={styles.profileContainer}>
//         <View style={styles.profileHeader}>
//           <View style={styles.profileInfo}>
//             <Image
//               source={
//                 user?.profileImage
//                   ? { uri: user.profileImage }
//                   : { uri: userData?.profileImage }
//               }
//               style={styles.profileImage}
//             />
//             <View>
//               <Text style={styles.name}>
//                 {Array.isArray(userData) ? userData[0]?.name : userData?.name}
//               </Text>
//               <Text style={styles.email}>
//                 {Array.isArray(userData) ? userData[0]?.email : userData?.email}
//               </Text>
//             </View>
//           </View>
//           <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
//             <Ionicons name="close" size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Menu Items */}
//       <View style={styles.menuContainer}>
//         <DrawerItem
//           icon="home-outline"
//           label="Home"
//           onPress={() => props.navigation.navigate("Main", { screen: "Home" })}
//         />
//         <DrawerItem
//           icon="person-outline"
//           label="Profile"
//           onPress={() =>
//             props.navigation.navigate("Main", { screen: "ProfilePage" })
//           }
//         />
//         <DrawerItem
//           icon="medkit-outline"
//           label="Add Medicine"
//           onPress={() =>
//             props.navigation.navigate("Main", { screen: "AddMedicine" })
//           }
//         />
//         <DrawerItem
//           icon="cash-outline"
//           label="Donations"
//           onPress={() =>
//             props.navigation.navigate("Main", { screen: "Donations" })
//           }
//         />

//         <DrawerItem
//           icon=""
//           label="Needs"
//           onPress={() => props.navigation.navigate("Main", { screen: "Needs" })}
//         />

//         <DrawerItem
//           icon=""
//           label="RequestMedicine"
//           onPress={() =>
//             props.navigation.navigate("Main", { screen: "RequestMedicine" })
//           }
//         />

//         <DrawerItem
//           icon=""
//           label="Update"
//           onPress={() =>
//             props.navigation.navigate("Main", { screen: "Update" })
//           }
//         />

//         <DrawerItem
//           icon=""
//           label="RequestsReview"
//           onPress={() => props.navigation.navigate("Main", { screen: "RequestsReview" })}
//         />

//         <DrawerItem
//           icon="log-out-outline"
//           label="Logout"
//           onPress={() => props.navigation.navigate("Main", { screen: "Login" })}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// // Reusable Drawer Item Component
// const DrawerItem = ({ icon, label, onPress }) => {
//   return (
//     <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
//       <Ionicons name={icon} size={22} color="black" />
//       <Text style={styles.drawerLabel}>{label}</Text>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   profileContainer: {
//     backgroundColor: "#01b3bd",
//     padding: 16,
//     marginBottom: 24,
//   },
//   profileHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   profileInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 16,
//     backgroundColor: "white",
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//   },
//   email: {
//     fontSize: 14,
//     color: "white",
//   },
//   menuContainer: {
//     marginTop: 16,
//   },
//   drawerItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//   },
//   drawerLabel: {
//     fontSize: 16,
//     marginLeft: 16,
//   },
// });




import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install this:  `expo install @expo/vector-icons`
import { useAuth } from "../hooks/useAuth";
import { useGetUserByIdQuery } from "../redux/Slice/user";

export const DrawerContent = (props) => {
  const { user, userName, userId } = useAuth();

  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useGetUserByIdQuery(userId);
  console.log("User Data in Drawer:", userData);
  console.log("User Name:", userData?.name);
  console.log("User Email:", userData?.email);
  console.log("User Profile Image:", userData?.profileImage);

  useEffect(() => {
    if (userData) {
      console.log("User Data in Drawer:", userData);
      const user = Array.isArray(userData) ? userData[0] : userData;
      console.log("User Name:", userData?.name);
      console.log("User Email:", userData?.email);
      console.log("User Profile Image:", userData?.profileImage);
    }
  }, [userData]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Profile Section */}
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Image
              source={
                user?.profileImage
                  ? { uri: user.profileImage }
                  : { uri: userData?.profileImage }
              }
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.name}>
                {Array.isArray(userData) ? userData[0]?.name : userData?.name}
              </Text>
              <Text style={styles.email}>
                {Array.isArray(userData) ? userData[0]?.email : userData?.email}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <DrawerItem
          icon="home-outline"
          label="Home"
          onPress={() => props.navigation.navigate("Main", { screen: "Home" })}
        />
        <DrawerItem
          icon="person-outline"
          label="Profile"
          onPress={() =>
            props.navigation.navigate("Main", { screen: "ProfilePage" })
          }
        />
        <DrawerItem
          icon="medkit-outline"
          label="Add Medicine"
          onPress={() =>
            props.navigation.navigate("Main", { screen: "AddMedicine" })
          }
        />
        <DrawerItem
          icon="cash-outline"
          label="Donations"
          onPress={() =>
            props.navigation.navigate("Main", { screen: "Donations" })
          }
        />
        <DrawerItem
          icon="medkit-outline"
          label="RequestMedicine"
          onPress={() =>
            props.navigation.navigate("Main", { screen: "RequestMedicine" })
          }
        />

        <DrawerItem
          icon="help-circle-outline"
          label="Needs"
          onPress={() => props.navigation.navigate("Main", { screen: "Needs" })}
        />

        <DrawerItem
          icon="document-text-outline"
          label="RequestsReview"
          onPress={() =>
            props.navigation.navigate("Main", { screen: "RequestsReview" })
          }
        />

        <DrawerItem
          icon="log-out-outline"
          label="Logout"
          onPress={() => props.navigation.navigate("Main", { screen: "Login" })}
        />
      </View>
    </SafeAreaView>
  );
};

// Reusable Drawer Item Component
const DrawerItem = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color="black" />
      <Text style={styles.drawerLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileContainer: {
    backgroundColor: "#01b3bd",
    padding: 16,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: "white",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  email: {
    fontSize: 14,
    color: "white",
  },
  menuContainer: {
    marginTop: 16,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerLabel: {
    fontSize: 16,
    marginLeft: 16,
  },
});
