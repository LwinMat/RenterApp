import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const ReservationScreen = ({ navigation }) => {
    const [reservationData, setReservationData] = useState(null);

    useEffect(() => {
        fetchReservationData();
    }, []);

    const fetchReservationData = async () => {
        try {
            const reservationDocRef = doc(db, 'booking', 'address');
            const reservationSnapshot = await getDoc(reservationDocRef);

            if (reservationSnapshot.exists()) {
                setReservationData(reservationSnapshot.data());
            } else {
                console.log('Reservation data not found');
            }
        } catch (error) {
            console.error('Error fetching reservation data: ', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headingText}>Reservation Details</Text>

            {reservationData ? (
                <View style={styles.reservationInfo}>
                    <Text>Type of Service: {reservationData.serviceType}</Text>
                    <Text>Description: {reservationData.description}</Text>
                    <Text>City: {reservationData.city}</Text>
                    <Text>Address: {reservationData.address}</Text>
                    <Text>Price: {reservationData.price}</Text>
                    <Text>Parts Included: {reservationData.includingParts ? 'Yes' : 'No'}</Text>
                    <Text>Labor Included: {reservationData.includingLabor ? 'Yes' : 'No'}</Text>
                </View>
            ) : (
                <Text style={styles.text}>Loading Reservation Data...</Text>
            )}
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
    text: {
        fontSize: 15,
        textAlign: 'center',
    },
    reservationInfo: {
        marginTop: 10,
    },
});

export default ReservationScreen;
