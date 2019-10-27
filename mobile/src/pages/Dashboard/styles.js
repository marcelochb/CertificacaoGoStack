import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const Content = styled.View`
  margin-top: 20px;
`;
export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
  align-self: center;
`;

export const Dia = styled.Text`
  /* font-family: 'Roboto'; */
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin: 0 15px;
`;

export const Banner = styled.Image`
  max-width: 100%;
  height: 200px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { padding: 30 },
})``;
