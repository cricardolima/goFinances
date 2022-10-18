import React from "react";
import "intl";
import "intl/locale-data/jsonp/pt-BR";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {ThemeProvider} from "styled-components";
import * as SplashScreen from "expo-splash-screen";

import {Poppins_400Regular, Poppins_500Medium, Poppins_700Bold, useFonts,} from "@expo-google-fonts/poppins";

import theme from "./src/global/styles/theme";

import {NavigationContainer} from "@react-navigation/native";

import {StatusBar} from "react-native";
import {SignIn} from "./src/screens/SignIn";

export default function App() {
    SplashScreen.preventAutoHideAsync();
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    SplashScreen.hideAsync();

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <ThemeProvider theme={theme}>
                <NavigationContainer>
                    <StatusBar
                        backgroundColor="transparent"
                        translucent
                        barStyle="light-content"
                    />
                    <SignIn/>
                </NavigationContainer>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
