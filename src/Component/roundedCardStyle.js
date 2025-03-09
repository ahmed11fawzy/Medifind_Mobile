import { StyleSheet } from "react-native";

export const roundedCard = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    post: {
        width: '90%',
        marginHorizontal: '5%',
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        boxShadow: '0 2px 3px rgb(2, 73, 77)',
    }

})