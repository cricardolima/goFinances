import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import { PropsWithChildren } from "react";

interface ButtonProps extends PropsWithChildren<RectButtonProps> {}


export const Container = styled(RectButton).attrs({
    activeOpacity: 0.7
})<ButtonProps>`
    background-color: ${({ theme }) => theme.colors.shape};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    padding: 18px 16px;
`;

export const Category = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
`;

export const Icon = styled(Feather as any)`
    font-size: ${RFValue(20)}px;
    color: ${({ theme }) => theme.colors.text};
`;