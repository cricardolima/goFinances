import React from "react";

import {NavigationContainer} from "@react-navigation/native";
import {AuthRoutes} from "./auth.routes";
import {useAuth} from "../hooks/auth";
import {AppRoutes} from "./app.routes";


export const Routes = () => {
    const {user} = useAuth();

    console.log(user)
    return (
        <NavigationContainer>
            {user.id ? <AppRoutes/> : <AuthRoutes/>}
        </NavigationContainer>
    )
}