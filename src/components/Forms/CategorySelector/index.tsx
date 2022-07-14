import React from "react";
import { Title } from "../../TransactionCard/styles";
import { Container, Category, Icon } from "./styles";

interface Props {
  title: string;
}

export const CategorySelector = ({ title }: Props) => {
  return (
    <Container>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
};
