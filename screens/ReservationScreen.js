import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, StatusBar, SafeAreaView, Image } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, where, query, getDocs } from 'firebase/firestore';

const ReservationScreen = ({ navigation }) => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const bookingsRef = collection(db, 'booking');
            const querySnapshot = await getDocs(bookingsRef);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReservations(data);
        } catch (error) {
            console.error('Error fetching reservations: ', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return '#2ecc71'; // Green
            case 'CANCELLED':
                return '#e74c3c'; // Red
            default:
                return '#000000'; // Black
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.reservationItem, { borderColor: getStatusColor(item.status) }]}>
            <Text>Type of Service: {item.serviceType}</Text>
            <Text>Description: {item.description}</Text>
            <Text>City: {item.city}</Text>
            <Text>Address: {item.address}</Text>
            <Text>Price: {item.price}</Text>
            <Text>Parts Included: {item.includingParts ? 'Yes' : 'No'}</Text>
            <Text>Labor Included: {item.includingLabor ? 'Yes' : 'No'}</Text>
            <Text>Owner Name: {item.ownerName}</Text>
            {item.ownerPhoto && <Image source={{ uri: item.ownerPhoto }} style={styles.ownerPhoto} />}
            <Text style={{ color: getStatusColor(item.status) }}>Booking Status: {item.status}</Text>
            <Text>Confirmation Code: {item.confirmationCode}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headingText}>All Reservations</Text>

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
        borderWidth: 2,
    },
    ownerPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginTop: 5,
    },
});

export default ReservationScreen;
