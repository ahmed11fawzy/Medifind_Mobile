import { View } from "react-native"
import { Button, Text } from "react-native-paper";
import { Colors } from '../constants/RootColor'
import { StyleSheet } from "react-native";
import { roundedCard } from "./roundedCardStyle";
export const RoundedCard = ({ medicine }) => {
    return (
        <View style={roundedCard.post}>
            <Text variant="headlineSmall"> Name :<Text style={{ color: Colors.mainColor, fontSize: '18', marginInlineEnd: '10' }} >{medicine.name}</Text> </Text>

            <Text>{medicine.concentration}</Text>
            <Text>{medicine.expire_date}</Text>
            <Button style={{ width: '30%', fontSize: '8', marginInlineStart: 'auto' }} mode="contained" buttonColor={Colors.mainColor} onPress={() => console.log('Pressed')}>
                Pick
            </Button>
        </View>
    )
};

const styles = StyleSheet.create({
    post: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});