import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTheme} from "styled-components";
import {HighlightCard} from "../../components/HighlightCard";
import {TransactionCard, TransactionCardProps,} from "../../components/TransactionCard";
import {
    Container,
    Header,
    HighlightCards,
    Icon,
    LoadContainer,
    LogoutButton,
    Photo,
    Title,
    TransactionList,
    Transactions,
    User,
    UserGreetings,
    UserInfo,
    UserName,
    UserWrapper,
} from "./styles";
import {useFocusEffect} from "@react-navigation/native";
import {useAuth} from "../../hooks/auth";

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    exits: HighlightProps;
    total: HighlightProps;
}

export const Dashboard = () => {
    const {logout, user} = useAuth();
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>(
        {} as HighlightData
    );
    const dataKey = "@goFinances:transaction";

    const getLastDate = (
        collection: DataListProps[],
        type: "positive" | "negative"
    ) => {
        const lastTransaction = new Date(
            Math.max.apply(
                Math,
                collection
                    .filter((item) => item.type === type)
                    .map((item) => new Date(item.date).getTime())
            )
        );

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
            "pt-BR",
            {month: "long"}
        )}`;
    };

    const loadTransactions = async () => {
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let totalEntries = 0;
        let totalExits = 0;

        const newTransaction: DataListProps[] = transactions.map(
            (transaction: DataListProps) => {
                if (transaction.type === "positive") {
                    totalEntries += Number(transaction.amount);
                } else {
                    totalExits += Number(transaction.amount);
                }

                const amount = Number(transaction.amount).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });

                const dateFormatted = Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                }).format(new Date(transaction.date));

                return {
                    id: transaction.id,
                    title: transaction.title,
                    amount,
                    type: transaction.type,
                    category: transaction.category,
                    date: dateFormatted,
                };
            }
        );
        setTransactions(newTransaction);

        const lastEntrieDate = getLastDate(transactions, "positive");
        const lastExitDate = getLastDate(transactions, "negative");
        const totalDate = `01 a ${lastExitDate}`;

        let total = totalEntries - totalExits;

        setHighlightData({
            entries: {
                amount: totalEntries.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
                lastTransaction:
                    totalEntries > 0
                        ? `Última entrada: ${lastEntrieDate}`
                        : "Nenhuma entrada",
            },
            exits: {
                amount: totalExits.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
                lastTransaction:
                    totalExits > 0
                        ? `Última entrada dia ${lastExitDate}`
                        : "Nenhuma saída",
            },
            total: {
                amount: total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
                lastTransaction: totalDate,
            },
        });

        setIsLoading(false);
    };

    useEffect(() => {
        loadTransactions();
        // const remove = async () => {
        //   await AsyncStorage.removeItem(dataKey);
        // };
        // remove();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadTransactions();
        }, [])
    );

    return (
        <Container>
            {isLoading ? (
                <LoadContainer>
                    <ActivityIndicator color={theme.colors.primary} size="large"/>
                </LoadContainer>
            ) : (
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo
                                    source={{
                                        uri: user.photo,
                                    }}
                                />
                                <User>
                                    <UserGreetings>Olá, </UserGreetings>
                                    <UserName>{user.name}</UserName>
                                </User>
                            </UserInfo>
                            <LogoutButton onPress={logout}>
                                <Icon name="power"/>
                            </LogoutButton>
                        </UserWrapper>
                    </Header>
                    <HighlightCards>
                        <HighlightCard
                            type="up"
                            title="Entradas"
                            amount={highlightData.entries.amount}
                            lastTransaction={highlightData.entries.lastTransaction}
                        />
                        <HighlightCard
                            type="down"
                            title="Saídas"
                            amount={highlightData.exits.amount}
                            lastTransaction={highlightData.exits.lastTransaction}
                        />
                        <HighlightCard
                            type="total"
                            title="Total"
                            amount={highlightData.total.amount}
                            lastTransaction={highlightData.total.lastTransaction}
                        />
                    </HighlightCards>
                    <Transactions>
                        <Title>Listagem</Title>
                        <TransactionList
                            data={transactions}
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) => <TransactionCard data={item}/>}
                        />
                    </Transactions>
                </>
            )}
        </Container>
    );
};
