import styled from "styled-components";

export const ButtonChamarGarcomMesa = styled.button`
    padding: .5rem;
    z-index: 1000;
    font-weight: 500;
    cursor: pointer;
    background: linear-gradient(135deg, #e5484d, #f1a94e);

    border-top: solid 1px white;
    border-left: solid 1px white;
    border-right: solid 1px white;

  &:hover {
    background: white;
    color: var(--realce);
    border-top: solid 1px var(--realce);
    border-left: solid 1px var(--realce);
    border-right: solid 1px var(--realce);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  }

  &:disabled {
    background: #ddd;
    cursor: not-allowed;
  }
    top: none;

    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    border-radius: 8px;
    width: 100%;
    height: unset;
`;

export const ContainerChoosingTable = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  color: var(--whiteSuave);
`;

export const ChoosingTable = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  margin-top: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  gap: 1rem;

  border-top: 1px solid var(--realce);
  border-left: 1px solid var(--realce);
  border-right: 1px solid var(--realce);

  color: var(--whiteSuave);

  background-color: var(--darkRed);

  input {
    padding: .8rem;
    border-radius: 15px;
    color: #333;
    width: 100%;
    border: 1px solid transparent;
    outline: none;

    &::placeholder {
      color: #333;
      padding: .5rem;

      font-weight: 700;
    }

    &:active {
      outline: 1px solid var(--realce);
    }

    &:not(:placeholder-shown) {
      outline: 1px solid var(--realce); /* Borda fica vermelha se o input tiver valor */
    }
  }
`;

export const ChoosingPadding = styled.div`
  padding: 1rem 1rem;

`;

export const Title = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--whiteSuave);
`;

export const Description = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: var(--whiteSuave);
  margin-bottom: 1.3rem;

  button {
    &:hover {
      text-decoration: underline;
      text-decoration-color: var(--realce);
    }
  }
`;

export const Warning = styled.p`
  font-size: 0.9rem;
  color: #e5484d;
  margin-top: 1rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  margin: 1rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: #4caf50;
    box-shadow: 0 0 4px rgba(76, 175, 80, 0.3);
  }
`;

export const ConfirmButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #4caf50;
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  transition: .1s ease-in;
  border: 1px solid transparent;

  &:hover {
    background-color: #fff;
    color: #4caf50;
    transition: .1s ease-in;
    border: 1px solid #4caf50;
  }

  &:active {
    background-color: #3e8e41;
  }
`;

export const FailedChoosingTable = styled.div`
  margin-top: 5rem;
`;
