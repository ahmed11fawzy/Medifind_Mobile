import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Button, Card } from 'react-native-paper';

const LeftContent = props => <Avatar.Icon {...props} icon="account" style={{ backgroundColor: '#66d5c1' }} />;
const DonationIcon = () => {
  return <Avatar.Icon size={50} icon="heart-plus" color="white" style={{ backgroundColor: "#49d3ac" }} />;
};
export function Donations() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' ,marginVertical: 10,fontFamily: 'serif'}} >Donations</Text> 
      <Text>{DonationIcon()}</Text>


      <Card style={styles.Card}>
        <Card.Title title="Heba Elgohary" left={LeftContent} />
        <Card.Content>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>name: Panadol</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Expire date: 10/10/2026</Text>
        </Card.Content>
        <Card.Cover source={{ uri: 'https://m.media-amazon.com/images/I/71+zWl1ONoL.jpg' }} style={styles.img} />
        <Card.Actions>
          <Button style={{ ...styles.btn, backgroundColor: '#e64e67' }} labelStyle={{ color: 'white' }}>delete</Button>
          <Button style={{ ...styles.btn, backgroundColor: '#66d5c1' }}>update</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.Card}>
        <Card.Title title="Heba Elgohary" left={LeftContent} />
        <Card.Content>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>name: Mebo</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Expire date: 10/10/2026</Text>
        </Card.Content>
        <Card.Cover source={{ uri: 'https://th.bing.com/th/id/OIP.FamTul24cTrDTfSnr8Ab2wHaHa?rs=1&pid=ImgDetMain' }} style={styles.img} />
        <Card.Actions>
          <Button style={{ ...styles.btn, backgroundColor: '#e64e67' }} labelStyle={{ color: 'white' }}>delete</Button>
          <Button style={{ ...styles.btn, backgroundColor: '#66d5c1' }}>update</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.Card}>
        <Card.Title title="Heba Elgohary" left={LeftContent} />
        <Card.Content>
          <Text style={{ fontSize: 18 }}>name:<Text style={{ color: '#6b696a', fontWeight: 'bold' }}> Alphentrin </Text></Text>
          <Text style={{ fontSize: 16 }}>Expire date:<Text style={{ color: '#e96776', fontWeight: 'bold' }}> 10/10/2026  </Text></Text>
        </Card.Content>
        <Card.Cover source={{ uri: 'https://th.bing.com/th/id/R.3cf9a41920a9836414e53bf767cc26fb?rik=fthDG3qml%2b9P9g&riu=http%3a%2f%2fwww.bloompharmacy.com%2fcdn%2fshop%2fproducts%2falphintern-30-tablets-238243.jpg%3fv%3d1687634811&ehk=AEolqjTXl04ia%2fsg1Mfe04rDYn2trrMWznRAsGUXHjA%3d&risl=&pid=ImgRaw&r=0' }} style={styles.img} />
        <Card.Actions>
          <Button style={{ ...styles.btn, backgroundColor: '#e64e67' }} labelStyle={{ color: 'white' }}>Delete</Button>
          <Button style={{ ...styles.btn, backgroundColor: '#66d5c1' }}>Update</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  Card: {
    width: '90%',
    marginVertical: 10,
    marginHorizontal: '5%',
    padding: 15,
  },
  img: {
    width: 250,
    height: 290,
    resizeMode: 'contain',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  btn: {
    flex: 1, 
    borderRadius: 15,
    paddingVertical: 3,
    marginHorizontal: 2,
    marginVertical: 10,
    border: 'none',
  }

});
