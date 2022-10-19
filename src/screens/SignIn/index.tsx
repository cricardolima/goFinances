import React, {useState} from 'react';
import {RFValue} from "react-native-responsive-fontsize";
import {ActivityIndicator, Alert, Platform} from "react-native";

import LogoSvg from '../../assets/logo.svg';
import GoogleSvg from '../../assets/google.svg';
import AppleSvg from '../../assets/apple.svg';

import {Container, Footer, FooterWrapper, Header, SignInTitle, Title, TitleWrapper} from './styles';
import {SignInSocialButton} from "../../components/SignInSocialButton";
import {useAuth} from "../../hooks/auth";
import {useTheme} from "styled-components";

export const SignIn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme();
    const {singInGoogle, signInApple} = useAuth();

    const handleSignInGoogle = async () => {
        try {
            setIsLoading(true);
            return await singInGoogle();
        } catch (e) {
            console.log(e);
            Alert.alert('Deu ruim');
            setIsLoading(false);
        }

    }

    const handleSignInApple = async () => {
        try {
            setIsLoading(true);
            return await signInApple();
        } catch (e) {
            console.log(e);
            Alert.alert('Deu ruim');
            setIsLoading(false);
        }
    }


    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg width={RFValue(120)} height={RFValue(68)}/>
                    <Title>Controle suas {'\n'} finanças de forma {'\n'} muito simples</Title>
                </TitleWrapper>
                <SignInTitle>Faça seu login com {'\n'} uma das contas abaixo</SignInTitle>
            </Header>
            <Footer>
                <FooterWrapper>
                    <SignInSocialButton title="Entrar com Google" svg={GoogleSvg} onPress={handleSignInGoogle}/>
                    {Platform.OS === 'ios' &&
                        <SignInSocialButton title="Entrar com Apple" svg={AppleSvg} onPress={handleSignInApple}/>}
                </FooterWrapper>
                {isLoading && <ActivityIndicator color={theme.colors.shape} style={{margin: 18}}/>}
            </Footer>
        </Container>
    );
}