import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  background: #000;
  padding: 0 25px;
`;

export const Content = styled.div`
  height: 92px;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  nav {
    display: flex;
    align-items: center;
    img {
      margin-right: 20px;
      padding-right: 20px;
      border-right: 1px solid #eee;
    }
    a {
      font-weight: bold;
      color: #fff;
      opacity: 0.9;

      &:hover {
        opacity: 1;
      }
    }
  }
  aside {
    display: flex;
    align-items: center;
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  div {
    text-align: right;
    margin-right: 30px;
    strong {
      display: block;
      color: #fff;
    }
    a {
      display: block;
      margin-top: 2px;
      font-size: 12px;
      color: #999;
      opacity: 0.9;

      &:hover {
        opacity: 1;
      }
    }
  }
  button {
    background: #d44059;
    height: 42px;
    border: 0;
    border-radius: 4px;
    color: #fff;
    font-weight: bold;
    width: 71px;
    font-size: 16px;
    transition: background 0.2s;

    &:hover {
      background: ${darken(0.08, '#d44059')};
    }
  }
`;
