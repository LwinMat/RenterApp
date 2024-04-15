import {View, Text, StyleSheet, FlatList, Platform, StatusBar, SafeAreaView, Pressable} from 'react-native';

import {db} from '../firebaseConfig';

import * as Location from 'expo-location';

import React, {useState, useEffect } from 'react';

import MapView, {Marker, Callout} from "react-native-maps"

import { collection, getDocs } from 'firebase/firestore';

const SearchScreen = ({navigation}) => {

    // booking state that extract data from firebase db from 'booking' collection
    const [bookings, setBookings] = useState([]);

    // useEffect to get data from firebase db
    useEffect(() => {
      requestPermissions();

      fetchBookings();
    }, []);

    const requestPermissions = async () => {
      try {          
         const permissionsObject = 
             await Location.requestForegroundPermissionsAsync()
         if (permissionsObject.status  === "granted") {
             alert("Permission granted!")              
         } else {
             alert("Permission denied or not provided")              
         }
      } catch (err) {
         console.log(err)
      }
    }
          
    const fetchBookings = async () => {
        const bookingCollection = await getDocs(collection(db, 'rentalListings'));
        const bookingsData = bookingCollection.docs.map(doc => ({...doc.data(), id: doc.id}));
        console.log(bookingsData);
    
        const bookingsWithCoordinates = await Promise.all(
            bookingsData.map(async (booking) => {
                const locations = await Location.geocodeAsync(
                    `${booking.address}, ${booking.city}`
                );
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
    };



    return (
        <SafeAreaView style={[styles.container]}>
            <Text style={[styles.text]}>Choose a spot and book a service</Text>

            <MapView
               style={{height:"95%", width:"100%"}}
               initialRegion={
                   {latitude:43.7, longitude:-79.42, latitudeDelta:0.1, longitudeDelta:0.1}
               }
               mapType={"terrain"}
               showsTraffic={true}
            >
               

            {bookings.map((booking, index) => (
                <Marker
                    key={index}
                    coordinate={booking.coordinates}
                    title={booking.city}
                >

                    <Callout>
                        <Text>Type of Service: {booking.serviceType}</Text>
                        <Text>Description: {booking.description}</Text>
                        <Text>City: {booking.city}</Text>
                        <Text>Address: {booking.address}</Text>
                        <Text>Price: {booking.price}</Text>
                        <Text>Parts Included: {booking.includingParts ? 'Yes' : 'No'}</Text>
                        <Text>Labor Included: {booking.includingLabor ? 'Yes' : 'No'}</Text>
                    </Callout>
                </Marker>
            ))}


            </MapView>

            {/* <Pressable onPress={()=>{fetchBookings()}}><Text>Bookings</Text></Pressable> */}

            
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#c7ecee",
      padding:20,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      paddingLeft: Platform.OS === "android" ? StatusBar.currentWidth : 0,
      paddingBottom: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      paddingRight: Platform.OS === "android" ? StatusBar.currentWidth : 0
    },
    headingText: {
      fontSize: 20,
      textAlign: "center",
      paddingBottom: 5,
    },
    text: {
      fontSize: 15,
      paddingBottom: 5,
    },    
});


  export default SearchScreen;