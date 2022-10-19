import React, {useState} from "react";
import {Alert, Keyboard, Modal} from "react-native";
import {TouchableWithoutFeedback} from "react-native-gesture-handler";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {NavigationProp, ParamListBase, useNavigation,} from "@react-navigation/native";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Button} from "../../components/Forms/Button";
import {InputForm} from "../../components/Forms/InputForm";
import {CategorySelectButton} from "../../components/Forms/CategorySelectButton";
import {TransactionTypeButton} from "../../components/Forms/TransactionTypeButton";

import {Container, Fields, Form, Header, Title, TransactionsTypes,} from "./styles";
import {CategorySelector} from "../CategorySelector";
import {useAuth} from "../../hooks/auth";

export interface FormData {
    [name: string]: any;

    [amount: number]: any;
}

const schema = yup.object({
    name: yup.string().required("O nome é obrigatório."),
    amount: yup
        .number()
        .typeError("Informe um valor numérico.")
        .positive("O valor não pode ser negativo.")
        .required("O valor é obrigatório."),
});

export const Register = () => {
    const {user} = useAuth();
    const [transactionType, setTransactionType] = useState("");
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState({
        key: "category",
        name: "Categoria",
    });

    const {navigate}: NavigationProp<ParamListBase> = useNavigation();

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<FormData>({resolver: yupResolver(schema)});

    const handleTransactionTypeSelect = (type: "positive" | "negative") => {
        setTransactionType(type);
    };

    const handleOpenSelectCategoryModal = () => {
        setCategoryModalOpen(true);
    };

    const handleCloseSelectCategoryModal = () => {
        setCategoryModalOpen(false);
    };

    const handleRegister = async (form: FormData) => {
        const dataKey = `@gofinances:transactions_user:${user.id}`;

        if (!transactionType) Alert.alert("Selecione o tipo de transação");

        if (category.key === "category") Alert.alert("Selecione uma categoria");

        const newData = {
            id: String(uuid.v4()),
            title: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date(),
        };

        try {
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [...currentData, newData];

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

            setTransactionType("");
            setCategory({key: "category", name: "Categoria"});
            reset();

            navigate("Listagem");
        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possível registrar a transação.");
        }
    };

    // useEffect(() => {
    //   const loadData = async () => {
    //     const data = await AsyncStorage.getItem(dataKey);
    //     console.log(JSON.parse(data!));
    //   };
    //   loadData();

    //   const remove = async () => {
    //     await AsyncStorage.removeItem(dataKey);
    //   }
    //   remove()
    // }),
    //   [];

    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            containerStyle={{flex: 1}}
            style={{flex: 1}}
        >
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>
                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name?.message}
                        />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount?.message}
                        />
                        <TransactionsTypes>
                            <TransactionTypeButton
                                type="up"
                                title="Income"
                                onPress={() => handleTransactionTypeSelect("positive")}
                                isActive={transactionType === "positive"}
                            />
                            <TransactionTypeButton
                                type="down"
                                title="Outcome"
                                onPress={() => handleTransactionTypeSelect("negative")}
                                isActive={transactionType === "negative"}
                            />
                        </TransactionsTypes>
                        <CategorySelectButton
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>
                    <Button title="Enviar" onPress={handleSubmit(handleRegister)}/>
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelector
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    );
};
