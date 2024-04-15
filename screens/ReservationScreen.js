import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, StatusBar, SafeAreaView } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, where, query, getDocs } from 'firebase/firestore';

const ReservationScreen = ({ navigation }) => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        fetchAcceptedReservations();
    }, []);

    const fetchAcceptedReservations = async () => {
        try {
            const bookingsRef = collection(db, 'booking');
            const q = query(bookingsRef, where('status', '==', 'Accepted'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReservations(data);
        } catch (error) {
            console.error('Error fetching accepted reservations: ', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.reservationItem}>
            <Text>Type of Service: {item.serviceType}</Text>
            <Text>Description: {item.description}</Text>
            <Text>City: {item.city}</Text>
            <Text>Address: {item.address}</Text>
            <Text>Price: {item.price}</Text>
            <Text>Parts Included: {item.includingParts ? 'Yes' : 'No'}</Text>
            <Text>Labor Included: {item.includingLabor ? 'Yes' : 'No'}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headingText}>Accepted Reservations</Text>

            <FlatList
                data={reservations}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#c7ecee",
        padding: 20,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    headingText: {
        fontSize: 20,
        textAlign: "center",
        paddingBottom: 10,
    },
    reservationItem: {
        backgroundColor: '#ffffff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
});

export default ReservationScreen;
