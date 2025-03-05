import React from "react";
import { StyleSheet, View, } from "react-native";
import { Button, Text, } from 'react-native-paper';
import { Colors } from '../constants/RootColor'
import { Styles } from '../constants/mainStyle'
import { FlatList } from "react-native";
export function Home() {
  return (
    <View style={[Styles.container, { marginVertical: '50' }]}>
      <Text variant="headlineMedium">
        <Text style={{ color: Colors.mainColor, display: 'block', marginInlineEnd: '10' }} >Give</Text>
        <Text>the Gift of Health: Donate</Text>
        <Text style={{ color: Colors.mainColor }} >Medicine</Text> Today !
      </Text>
      <Text variant="titleSmall" style={{ color: Colors.secondaryColor }} >
        Every donated pill is a beacon of hope for someone in need. Join us in our mission to provide essential medicines to underserved
        communities. By giving the gift of health, you're offering more than just medicine - you're offering a chance at a healthier,
        brighter future. Donate today and become a vital part of our healing mission.
      </Text>
      <Button style={[Style.width50, Styles.mY]} mode="elevated" textColor={Colors.baseColor} buttonColor={Colors.mainColor} onPress={() => console.log('Pressed')}>
        Donate
      </Button>
      <Text variant="headlineLarge" style={[Styles.mY]} > Available Medicine </Text>
      <FlatList>

      </FlatList>
    </View>
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
