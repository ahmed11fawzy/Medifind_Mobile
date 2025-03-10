import { View } from "react-native"
import { Button, Text } from "react-native-paper";
import { Colors } from '../constants/RootColor'
import { StyleSheet } from "react-native";
import { roundedCard } from "./roundedCardStyle";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export const RoundedCard = ({ medicine }) => {
    return (
        <View style={roundedCard.post}>
            <View style={roundedCard.row} >
                <Icon name="account" size={30} color="#9AA6B2" />
                <View style={{marginInlineStart:"20"  }} >
                    <Text variant="titleLarge" >
                        {medicine.user_id.name}
                    </Text> 
                    <Text style={{marginVertical:'15'}} > Name : {medicine.name}
                        <Text style={{ color: Colors.mutedColor 
                                    ,marginInlineStart:"10" }}>
                                    {medicine.concentration}
                        </Text>
                    </Text>
                    <Text> Expire_date : {medicine.expire_date.split('-').slice(0,2).join('-')}</Text>
                </View>
            </View>
           
            <Button style={{ width: '30%', fontSize: '8', marginInlineStart: 'auto' }} mode="contained" buttonColor={Colors.mainColor} onPress={() => console.log('Pressed')}>
                Pick
            </Button>
        </View>
    )
};

