import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Platform, StatusBar, SafeAreaView, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';

const SignupScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);

    const handleRenterSignup = async () => {
        const user = {
            f_name: firstName,
            l_name: lastName,
            u_email: email,
            is_owner: false,
            bookings: [],
            profile_image: "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png"
        };

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Account creation success");
            console.log(userCredential);
            Alert.alert("Account created!");
            const docRef = await addDoc(collection(db, "users"), user);
            console.log(`Id of inserted document is: ${docRef.id}`);
            navigation.navigate('Home');
        } catch (err) {
            setError(err);
            console.log("Error when creating user");
            console.log(`Error code: ${err.code}`);
            console.log(`Error message: ${err.message}`);
            Alert.alert("Signup Error", err.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop: 50, flex: 0.9 }}>
                {/* Input fields for signup */}
                <View style={styles.myfields}>
                    <Text style={styles.text}>First Name:</Text>
                    <TextInput
                        style={styles.Input}
                        onChangeText={setFirstName}
                        value={firstName}
                    />
                </View>
                <View style={styles.myfields}>
                    <Text style={styles.text}>Last Name:</Text>
                    <TextInput
                        style={styles.Input}
                        onChangeText={setLastName}
                        value={lastName}
                    />
                </View>
                <View style={styles.myfields}>
                    <Text style={styles.text}>Email:</Text>
                    <TextInput
                        style={styles.Input}
                        onChangeText={setEmail}
                        value={email}
                    />
                </View>
                <View style={styles.myfields}>
                    <Text style={styles.text}>Password:</Text>
                    <TextInput
                        style={styles.Input}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={true}
                    />
                </View>
            </View>
            <View>
                <Pressable style={styles.Button} onPress={handleRenterSignup}>
                    <Text style={[styles.text, { color: 'white' }]}>Signup</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    headingBar: {
        flex: 0.2,
        alignItems: "center",
        backgroundColor: "#686de0",
        marginBottom: 50,
        justifyContent: "center",
        marginHorizontal: 10
    },
    text: {
        fontSize: 25,
        fontWeight: "bold"
    },
    myfields: {
        flex: 0.2,
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    Input: {
        marginLeft: 20,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 100,
        backgroundColor: 'white',
        width: 180,
        paddingLeft: 20,
        fontSize: 20
    },
    Button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#686de0',
        borderRadius: 10,
        margin: 10
    }
});

export default SignupScreen;
