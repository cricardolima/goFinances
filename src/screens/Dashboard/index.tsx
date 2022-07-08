import { HighlightCard } from "../../components/HighlightCard";
import {
  Container,
  Header,
  Icon,
  Photo,
  User,
  UserGreetings,
  UserInfo,
  UserName,
  UserWrapper,
  HighlightCards,
} from "./styles";

export const Dashboard = () => {
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{
                uri: "https://avatars.githubusercontent.com/u/81661730?v=4",
              }}
            />
            <User>
              <UserGreetings>Olá, </UserGreetings>
              <UserName>Ricardo</UserName>
            </User>
          </UserInfo>
          <Icon name="power" />
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard />
        <HighlightCard />
        <HighlightCard />
      </HighlightCards>
    </Container>
  );
};
