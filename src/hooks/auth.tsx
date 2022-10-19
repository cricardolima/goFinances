import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from "@react-native-async-storage/async-storage";


const {CLIENT_ID} = process.env;
const {REDIRECT_URI} = process.env;

interface Props {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface IAuthContextData {
    user: User;
    authLoading: boolean;

    signInApple(): Promise<void>;

    singInGoogle(): Promise<void>;

    logout(): Promise<void>;
}

interface AuthorizationResponse {
    params: {
        access_token: string;
    };
    type: string;
}

export const AuthContext = createContext({} as IAuthContextData);

export const AuthProvider = ({children}: Props) => {
    const [user, setUser] = useState<User>({} as User);
    const [authLoading, setAuthLoading] = useState(true);

    const userStorageKey = '@gofinances:user';

    const singInGoogle = async () => {
        try {
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const {params, type} = await AuthSession.startAsync({authUrl}) as AuthorizationResponse;

            if (type === 'success') {
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
                const userInfo = await response.json();

                setUser({
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.given_name,
                    photo: userInfo.picture,
                })
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userInfo))
            }

        } catch (e) {
            throw new Error(e)
        }
    }

    const signInApple = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            })
            if (credential) {
                const name = credential.fullName!.givenName!;
                const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;
                const userInfo = {
                    id: String(credential.user),
                    email: credential.email!,
                    name,
                    photo,
                }
                setUser(userInfo);
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userInfo))
            }


        } catch (e) {
            throw new Error(e)
        }
    }

    const logout = async () => {
        setUser({} as User);
        await AsyncStorage.removeItem(userStorageKey);
    }

    useEffect(() => {
        const loadUser = async () => {
            const userData = await AsyncStorage.getItem(userStorageKey);
            if (userData) {
                const data = JSON.parse(userData) as User;
                setUser(data);
            }
            setAuthLoading(false);
        }
        loadUser();
    }, [])

    return (
        <AuthContext.Provider value={{user, authLoading, singInGoogle, signInApple, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
