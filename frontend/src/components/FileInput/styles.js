import styled from 'styled-components';

export const Container = styled.div`
  margin-bottom: 30px;
  label {
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.1);
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }

    img {
      height: 300px;
      border-radius: 4px;
      border: 0;
      background: rgba(0, 0, 0, 0.1);
    }
    input {
      display: none;
    }
  }
`;
