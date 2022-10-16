import React, {useEffect, useState} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {HistoryCard} from "../../components/HistoryCard";

import {ChartContainer, Container, Content, Header, Title} from './styles'
import {categories} from "../../utils/categories";
import {VictoryPie} from "victory-native";
import {RFValue} from "react-native-responsive-fontsize";
import {useTheme} from "styled-components";

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
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    const theme = useTheme();
    const loadData = async () => {
        const dataKey = "@goFinances:transaction";
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted
            .filter((item: TransactionData) => item.type === 'negative');

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
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <Container>
            <Header>
                <Title>
                    Resumo por categoria
                </Title>
            </Header>
            <Content>
                <ChartContainer>
                    <VictoryPie data={totalByCategories} x="percent" y="total"
                                colorScale={totalByCategories.map(item => item.color)}
                                style={{labels: {fontSize: RFValue(18), fontWeight: 'bold', fill: theme.colors.shape}}}
                                labelRadius={50}/>
                </ChartContainer>
                {
                    totalByCategories.map(item => (
                        <HistoryCard key={item.key} title={item.name} amount={item.totalFormatted} color={item.color}/>
                    ))
                }
            </Content>
        </Container>
    )
}