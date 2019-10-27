import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Dados = styled.View`
  padding: 15px;
  background: #fff;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;

export const Titulo = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

export const Linha = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 11px;
`;

export const Texto = styled.Text`
  color: #999;
`;

export const SubmitButton = styled(Button)`
  margin-top: 20px;
  background: #e5556e;
`;
