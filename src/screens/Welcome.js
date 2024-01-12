import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../constant/colors';
import Button from '../components/Button';
import { useNavigation } from "@react-navigation/native";
export default function Welcome(){
    const navigation = useNavigation();
    return (
        
        <LinearGradient
            style={{
                flex: 1
            }}
            colors={[COLORS.black, COLORS.grey]}
            
        >
            <View style={{ flex: 1 }}>
                <View>
                    <Image
                        source={require("../../assets/images/hero1.jpg")}
                        style={{
                            height: 120,
                            width: 100,
                            borderRadius: 13,
                            position: "absolute",
                       top:5,
                            transform: [
                                { translateX: 30 },
                                { translateY: 50 },
                                { rotate: "-50deg" }
                            ]
                        }}
                    />

                    <Image
                        source={require("../../assets/images/hero4.jpg")}
                        style={{
                            height: 100,
                            width: 100,
                            borderRadius: 10,
                            position: "absolute",
                            top: -30,
                            left: 100,
                            transform: [
                                { translateX: 50 },
                                { translateY: 50 },
                                { rotate: "-50deg" }
                            ]
                        }}
                    />

                    <Image
                        source={require("../../assets/images/hero3.jpg")}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 20,
                            position: "absolute",
                            top: 130,
                            left: -50,
                            transform: [
                                { translateX: 50 },
                                { translateY:55 },
                                { rotate: "-56deg" }
                            ]
                        }}
                    />

                    <Image
                        source={require("../../assets/images/hero2.jpg")}
                        style={{
                            height: 200,
                            width: 200,
                            borderRadius: 20,
                            position: "absolute",
                            top: 110,
                            left: 100,
                            transform: [
                                { translateX: 50 },
                                { translateY: 50 },
                                { rotate: "-50deg" }
                            ]
                        }}
                    />
                </View>

                {/* content  */}

                <View style={{
                    paddingHorizontal: 22,
                    position: "absolute",
                    top: 400,
                    width: "100%"
                }}>
                    <Text style={{
                        fontSize: 50,
                        fontWeight: 800,
                        color: COLORS.white
                    }}>Cinema Go</Text>
                    

                    <View style={{ marginVertical: 22 }}>
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.white,
                            marginVertical: 4
                        }}>Movie And Tv Shows Anytime ,Anywhere</Text>
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.white,
                        }}>Comedies,Dramas,Family Entertainment And More</Text>
                    </View>

                    <Button
                        title="Join Now"
                        onPress={() => navigation.navigate("Signup")}
                        style={{
                            marginTop: 22,
                            width: "100%"
                        }}
                    />

                    <View style={{
                        flexDirection: "row",
                        marginTop: 12,
                        justifyContent: "center"
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.white
                        }}>Already have an account ?</Text>
                        <Pressable
                            onPress={() => navigation.navigate("Login")}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: COLORS.white,
                                fontWeight: "bold",
                                marginLeft: 4
                            }}>Login</Text>
                        </Pressable>

                    </View>
                </View>
            </View>
        </LinearGradient>
    )
}

