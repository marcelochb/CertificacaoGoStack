import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  padding: 0 25px;
`;

export const Content = styled.div`
  max-width: 1440px;
  margin: 50px auto;
  header {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: space-between;
    strong {
      color: #fff;
      font-size: 32px;
    }
  }
  img {
    height: 300px;
    width: 100%;
    margin-top: 50px;
  }
  p {
    color: #fff;
    font-size: 18px;
    margin-top: 25px;
  }
  footer {
    margin-top: 25px;
    display: flex;
    align-items: left;
  }
`;

export const Data = styled.span`
  color: #999;
  margin-right: 30px;
`;
export const Local = styled.span`
  color: #999;
`;

export const Botoes = styled.div`
  display: flex;
  /* align-self: center; */
`;

export const Editar = styled.button`
  background: #4dbaf9;
  display: flex;
  align-items: center;
  border: 0;
  border-radius: 4px;
  height: 42px;
  max-width: 116px;
  padding: 0 15px;
  font-weight: bold;
  color: #fff;
  transition: background 0.2s;

  &:hover {
    background: ${darken(0.08, '#4dbaf9')};
  }
  margin-right: 15px;
  svg {
    font-size: 20px;
    margin-right: 10px;
  }
`;

export const Cancelar = styled.button`
  background: #d44059;
  display: flex;
  align-items: center;
  border: 0;
  border-radius: 4px;
  height: 42px;
  max-width: 116px;
  padding: 0 15px;
  font-weight: bold;
  color: #fff;
  font-weight: bold;
  transition: background 0.2s;

  &:hover {
    background: ${darken(0.08, '#d44059')};
  }
  svg {
    font-size: 20px;
    margin-right: 10px;
  }
`;
