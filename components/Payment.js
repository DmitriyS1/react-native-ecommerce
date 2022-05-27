import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export function Payment({ shopHash, rubAmount, created, etherAmount, payerAddress, isPayedToShop, comission, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.infoContainer}>
                <Text style={styles.name}>Shop: {shopHash}</Text>
                <Text style={styles.name}>Payer: {payerAddress}</Text>
                <Text style={styles.name}>Is payed to shop: {isPayedToShop}</Text>
                <Text style={styles.name}>Payment date: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(created)}</Text>
                <Text style={styles.price}>RUB: {rubAmount}</Text>
                <Text style={styles.price}>Wei: {etherAmount}</Text>
                <Text style={styles.price}>Commission (Wei): {comission}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowColor: 'black',
        shadowOffset: {
            height: 0,
            width: 0,
        },
        elevation: 1,
        marginVertical: 20,
    },
    thumb: {
        height: 260,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        width: '100%',
    },
    infoContainer: {
        padding: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
});
