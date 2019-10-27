import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  padding: 0 25px;
`;
export const Content = styled.div`
  max-width: 1440px;
  margin: 50px auto;
  form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    input {
      background: rgba(0, 0, 0, 0.1);
      border: 0;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: #fff;
      margin: 0 0 10px;
      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }
    span {
      color: #fb6f91;
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
    }

    textarea {
      display: flex;
      align-items: flex-start;
      background: rgba(0, 0, 0, 0.1);
      border: 0;
      border-radius: 4px;
      height: 200px;
      padding: 15px 15px;
      color: #fff;
      margin: 0 0 10px;
      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    aside {
      display: flex;
      justify-content: flex-end;

      button {
        display: flex;
        margin: 5px 0 0;
        padding: 0 15px;
        height: 44px;
        max-width: 172px;
        background: #f94d6a;
        font-weight: bold;
        color: #fff;
        border: 0;
        border-radius: 4px;
        font-size: 16px;
        transition: background 0.2s;
        &:hover {
          background: ${darken(0.03, '#F94D6A')};
        }
        svg {
          margin-right: 5px;
        }
      }
    }
  }
`;
