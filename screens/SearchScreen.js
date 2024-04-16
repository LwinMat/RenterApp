import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, SafeAreaView, Pressable, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import * as Location from 'expo-location';
import MapView, { Marker, Callout } from "react-native-maps";
import { collection, getDocs, addDoc } from 'firebase/firestore';

const SearchScreen = ({ navigation }) => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        requestPermissions();
        fetchBookings();
    }, []);

    const requestPermissions = async () => {
        try {
            const permissionsObject = await Location.requestForegroundPermissionsAsync();
            if (permissionsObject.status === "granted") {
                alert("Permission granted!");
            } else {
                alert("Permission denied or not provided");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchBookings = async () => {
        try {
            const bookingCollection = await getDocs(collection(db, 'rentalListings'));
            const bookingsData = bookingCollection.docs.map(doc => ({ ...doc.data(), id: doc.id }));

            const bookingsWithCoordinates = await Promise.all(
                bookingsData.map(async (booking) => {
                    const locations = await Location.geocodeAsync(`${booking.address}, ${booking.city}`);
                    return {
                        ...booking,
                        coordinates: {
                            latitude: locations[0].latitude,
                            longitude: locations[0].longitude,
                        },
                    };
                })
            );

            setBookings(bookingsWithCoordinates);
        } catch (error) {
            console.error('Error fetching bookings: ', error);
        }
    };

    const generateConfirmationCode = () => {
        const confirmationCodeLength = 6;
        const characters = '0123456789';
        let code = '';
        for (let i = 0; i < confirmationCodeLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }
        return code;
    };

    const handleBookNow = async () => {
        if (!selectedBooking) {
            return;
        }

        try {
            const confirmationCode = generateConfirmationCode();

            // Attempt to book the selected item
            const docRef = await addDoc(collection(db, 'booking'), {
                serviceType: selectedBooking.serviceType,
                description: selectedBooking.description,
                city: selectedBooking.city,
                address: selectedBooking.address,
                price: selectedBooking.price,
                includingParts: selectedBooking.includingParts,
                includingLabor: selectedBooking.includingLabor,
                status: 'CONFIRMED', // Initial status
                confirmationCode: confirmationCode,
                image: selectedBooking.imageUrl,
            });

            console.log("Booking added with ID: ", docRef.id);

            Alert.alert(
                "Booking Requested",
                `Your booking request has been submitted. Confirmation Code: ${confirmationCode}`,
                [{ text: "OK", onPress: () => console.log("OK Pressed") }]
            );
        } catch (error) {
            console.error("Error adding booking: ", error);
            Alert.alert(
                "Error",
                "An error occurred while processing your booking request. Please try again later.",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }]
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Choose a spot and book a service</Text>

            <MapView
                style={{ flex: 1 }}
                initialRegion={{ latitude: 43.7, longitude: -79.42, latitudeDelta: 0.1, longitudeDelta: 0.1 }}
                mapType={"terrain"}
                showsTraffic={true}
            >
                {bookings.map((booking, index) => (
                    <Marker
                        key={index}
                        coordinate={booking.coordinates}
                        title={booking.city}
                        onPress={() => setSelectedBooking(booking)}
                    >
                        <Callout>
                            <Text>Type of Service: {booking.serviceType}</Text>
                            <Text>Description: {booking.description}</Text>
                            <Text>City: {booking.city}</Text>
                            <Text>Address: {booking.address}</Text>
                            <Text>Price: {booking.price}</Text>
                            <Text>Parts Included: {booking.includingParts ? 'Yes' : 'No'}</Text>
                            <Text>Labor Included: {booking.includingLabor ? 'Yes' : 'No'}</Text>
                            <Pressable style={styles.bookNowButton} onPress={handleBookNow}>
                                <Text style={styles.bookNowButtonText}>BOOK NOW</Text>
                            </Pressable>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
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
    text: {
        fontSize: 15,
        paddingBottom: 5,
        textAlign: 'center',
    },
    bookNowButton: {
        backgroundColor: '#686de0',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    bookNowButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default SearchScreen;