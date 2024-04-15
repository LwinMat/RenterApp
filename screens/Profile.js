import {View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, StatusBar, SafeAreaView, Image} from 'react-native';

import React from 'react';
import { db, auth } from '../firebaseConfig';

const ProfileScreen = ({navigation}) => {
  console.log(auth.currentUser)
  //const userName = auth.currentUser?.f_name + " " + auth.currentUser?.l_name
  const userEmail = auth.currentUser.email
  const userURL = auth.currentUser?.profile_image

    return (
        <SafeAreaView style={[styles.container]}>
          <Image source={userURL} style={{height: 20, width: 20}}>

          </Image>
            <Text>
             </Text>
            <Text>
              {userEmail}
            </Text>

            
        </SafeAreaView>
    );
}

export default ProfileScreen;

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
      fontSize: 12,
    },    
  });
