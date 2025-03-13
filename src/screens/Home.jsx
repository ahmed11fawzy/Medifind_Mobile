import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Button, Text, } from 'react-native-paper';
import { Colors } from '../constants/RootColor'
import { Styles } from '../constants/mainStyle'
import { FlatList } from "react-native";
import { useGetAcceptedMedicinesQuery } from "../redux/Slice/medicine"
import { RoundedCard } from "../Component/roundedCard";
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

export function Home() {
  const { isAuthenticated, userId, tokenData, userRole } = useAuth();
  const navigation = useNavigation();

  if (isAuthenticated) {
    console.log(userId);
    console.log(tokenData);
    console.log(userRole);
  }
  const { data: acceptedMedicines, isLoading, isError, error } = useGetAcceptedMedicinesQuery();
  const heroSection = () => (
    <View style={[Styles.container, { marginVertical: '50' }]}>
      <Image
        source={require('../../assets/gift-box.png')}
        style={{ width: 300, height: 280 }}
      ></Image>
      <Text variant="headlineMedium">
        <Text style={{ color: Colors.mainColor, display: 'block', marginInlineEnd: '10' }} >Give</Text>
        <Text>the Gift of Health: Donate</Text>
        <Text style={{ color: Colors.mainColor }} >Medicine</Text> Today !
      </Text>
      <Text variant="titleSmall" style={{ color: Colors.secondaryColor }} >
        Every donated pill is a beacon of hope for someone in need.
      </Text>
      <Button style={[Style.width50, Styles.mY]} mode="elevated" textColor={Colors.baseColor} buttonColor={Colors.mainColor} onPress={() => navigation.navigate("AddMedicine")}
      >
        Donate
      </Button>
      <Text variant="headlineLarge" style={[Styles.mY]} > Available Medicine </Text>

    </View>
  )

  return (

    <FlatList
      data={acceptedMedicines?.data}
      ListHeaderComponent={heroSection}
      renderItem={({ item }) => <RoundedCard medicine={item} />}
      keyExtractor={(item) => item._id}
      style={{ backgroundColor: "#ffffff" }}
    />

  );
}


const Style = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  width50: {
    width: '50%',
  }
})
