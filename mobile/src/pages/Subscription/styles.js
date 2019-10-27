import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const Content = styled.View`
  margin-top: 20px;
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
