import React, {useEffect, useState} from 'react'
import {
    Container,
    Header,
    Title,
    Content,
} from './styles'
import {HistoryCard} from "../../components/HistoryCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {categories} from "../../utils/categories";

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
    total: string;
    color: string;
}

export const Resume = () => {
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    const loadData = async () => {
        const dataKey = "@goFinances:transaction";
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted
            .filter((item: TransactionData) => item.type === 'negative')

        const totalByCategory: CategoryData[] = []

        categories.forEach(category => {
            let categorySum = 0;
            expensives.forEach((item: TransactionData) => {
                if (item.category === category.key) {
                    categorySum += Number(item.amount);
                }
            })

            if(categorySum > 0) {
                const total = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })
                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total,
                    color: category.color
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
                {
                    totalByCategories.map(item => (
                        <HistoryCard key={item.key} title={item.name} amount={item.total} color={item.color}/>
                    ))
                }
            </Content>
        </Container>
    )
}