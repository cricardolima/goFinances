import React from "react";
import "intl";
import "intl/locale-data/jsonp/pt-BR";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {ThemeProvider} from "styled-components";
import * as SplashScreen from "expo-splash-screen";

import {Poppins_400Regular, Poppins_500Medium, Poppins_700Bold, useFonts,} from "@expo-google-fonts/poppins";

import theme from "./src/global/styles/theme";

import {Routes} from "./src/routes";

import {StatusBar} from "react-native";
import {AuthProvider, useAuth} from "./src/hooks/auth";

export default function App() {
    const {authLoading} = useAuth();
    SplashScreen.preventAutoHideAsync();
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
    });

    if (!fontsLoaded || authLoading) {
        return null;
    }

    SplashScreen.hideAsync();

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <ThemeProvider theme={theme}>
                <StatusBar
                    backgroundColor="transparent"
                    translucent
                    barStyle="light-content"
                />
                <AuthProvider>
                    <Routes/>
                </AuthProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
