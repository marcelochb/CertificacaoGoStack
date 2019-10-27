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
    align-self: center;
    justify-content: space-between;
    strong {
      color: #fff;
      font-size: 32px;
    }
    button {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
      background: #d44059;
      border: 0;
      border-radius: 4px;
      height: 42px;
      max-width: 172px;
      color: #fff;
      font-size: 16px;
      padding: 0 15px;
      font-weight: bold;
      transition: background 0.2s;

      &:hover {
        background: ${darken(0.08, '#d44059')};
      }
      svg {
        margin-right: 8px;
        font-size: 20px;
      }
    }
  }
  ul {
    display: grid;
    grid-gap: 10px;
    margin-top: 50px;
  }
`;

export const Linha = styled.li`
  padding: 20px;
  background: rgba(0, 0, 0, 0.1);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-self: center;
  border-radius: 4px;

  opacity: ${props => (props.past ? 0.6 : 1)};

  span {
    display: flex;
    align-items: center;
    margin-top: 2px;
    color: #999;
    align-self: center;
    svg {
      margin-left: 30px;
      align-self: center;
      color: #fff;
      cursor: pointer;
      font-size: 24px;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }
  }
`;
export const Titulo = styled.strong`
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;
