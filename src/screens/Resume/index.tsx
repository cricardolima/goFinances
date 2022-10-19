import React, {useCallback, useState} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {HistoryCard} from "../../components/HistoryCard";

import {
    ChartContainer,
    Container,
    Content,
    Header,
    LoadContainer,
    Month,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Title
} from './styles'
import {categories} from "../../utils/categories";
import {VictoryPie} from "victory-native";
import {RFValue} from "react-native-responsive-fontsize";
import {addMonths, format, subMonths} from 'date-fns';
import {ptBR} from "date-fns/locale";
import {useTheme} from "styled-components";
import {ActivityIndicator} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import {useAuth} from "../../hooks/auth";

export interface TransactionData {
    type: "positive" | "negative";
    title: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export const Resume = () => {
    const {user} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [dateSelected, setDateSelected] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const theme = useTheme();

    const handleDateChange = (action: 'next' | 'prev') => {
        if (action === 'next') {
            setDateSelected(addMonths(dateSelected, 1));
        } else {
            setDateSelected(subMonths(dateSelected, 1));
        }
    }


    const loadData = async () => {
        setIsLoading(true);
        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted
            .filter((item: TransactionData) => item.type === 'negative' && new Date(item.date).getMonth() === dateSelected.getMonth() && new Date(item.date).getFullYear() === dateSelected.getFullYear());

        const expensivesTotal = expensives
            .reduce((acumullator: number, item: TransactionData) => {
                return acumullator + Number(item.amount);
            }, 0);

        const totalByCategory: CategoryData[] = []

        categories.forEach(category => {
            let categorySum = 0;
            expensives.forEach((item: TransactionData) => {
                if (item.category === category.key) {
                    categorySum += Number(item.amount);
                }
            })

            if (categorySum > 0) {
                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })

                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total: categorySum,
                    totalFormatted,
                    color: category.color,
                    percent,
                })
            }
        })

        setTotalByCategories(totalByCategory);
        setIsLoading(false)
    }

    useFocusEffect(useCallback(() => {
        loadData()
    }, [dateSelected]))

    return (
        <Container>
            <Header>
                <Title>
                    Resumo por categoria
                </Title>
            </Header>
            {isLoading ?
                <LoadContainer>
                    <ActivityIndicator color={theme.colors.primary} size="large"/>
                </LoadContainer> :
                <Content>
                    <MonthSelect>
                        <MonthSelectButton onPress={() => handleDateChange('prev')}>
                            <MonthSelectIcon name="chevron-left"/>
                        </MonthSelectButton>
                        <Month>{format(dateSelected, 'MMMM, yyyy', {locale: ptBR})}</Month>
                        <MonthSelectButton onPress={() => handleDateChange('next')}>
                            <MonthSelectIcon name="chevron-right"/>
                        </MonthSelectButton>
                    </MonthSelect>
                    <ChartContainer>
                        <VictoryPie data={totalByCategories} x="percent" y="total"
                                    colorScale={totalByCategories.map(item => item.color)}
                                    style={{
                                        labels: {
                                            fontSize: RFValue(18),
                                            fontWeight: 'bold',
                                            fill: theme.colors.shape
                                        }
                                    }}
                                    labelRadius={50}/>
                    </ChartContainer>
                    {
                        totalByCategories.map(item => (
                            <HistoryCard key={item.key} title={item.name} amount={item.totalFormatted}
                                         color={item.color}/>
                        ))
                    }
                </Content>
            }
        </Container>
    )
}