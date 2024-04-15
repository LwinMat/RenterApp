// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// react navigation plugin imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';

// used with stack navigators:
import 'react-native-gesture-handler';

// import screens
import LoginScreen from './screens/LoginScreen';

import SearchScreen from './screens/SearchScreen';
import ReservationScreen from './screens/ReservationScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Search" component={SearchScreen} options={{tabBarIcon: ()=>{return(<MaterialCommunityIcons name="map-search" size={24} color="black" />)}}}/>
      <Tab.Screen name="Reservation" component={ReservationScreen} options={{tabBarIcon: ()=>{return(<FontAwesome6 name="book-open" size={24} color="black" />)}}}/>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
