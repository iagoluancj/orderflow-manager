import styled from "styled-components";

// Estilização do button primitivo, a qual foi realizada por mim e é oque tenho utilizado nos input's de minhas aplicações.

interface FocusedField {
  $focusField: boolean;
}

export const InputTextLabel = styled.div<FocusedField>`
    position: absolute;
    margin-top: 0.6rem;
    padding: 0rem;
    background: transparent;
    padding-left: 1rem;
    border-radius: 10px 10px 10px 1px;
    transition: ease-in 0.2s;
    font-family: 'Poppins';
    font-weight: 400;
    color: #000;
    transition: ease-in .2s;

    ${({ $focusField }) =>
    $focusField &&
    `  
    margin-top: -0.8rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
        border-top: 2px solid var(--realce);
    border-left: 2px solid var(--realce);
    border-right: 2px solid var(--realce);
    `}

    background-color: var(--whiteSuave);
    /* background-color: var(--realce); */

    input {
      outline: none;
    }
`;

export const InputInput = styled.input`
    transition: ease-in 0.1s;
    padding: 0.5rem 0rem;
    border-radius: 10px;
    padding-left: 0.5rem;
    text-align: start !important;

    background-color: ${({ disabled }) => (disabled ? "#f5f5f5" : "#fff")}; 
    border: ${({ disabled }) => (disabled ? "2px solid var(--defaultText)" : "2px solid var(--focusText)")};  
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "text")}; 
    border: 2px solid var(--realce);
    background-color: ${(props) => props.theme.background};
    color: var(--realce);

    &:focus {
      border: 2px solid var(--realce);
      background-color: var(--whiteSuave);
    }
    outline: none;
    transition: ease-in .2s;
`;

export const DivInput = styled.div`
  width: 100%;
  transition: ease-in .2s;
  color: ${(props) => props.theme.background};
  background-color: ${(props) => props.theme.background};  
`;

export const InputError = styled.span`  
  font-weight: 200;
  color: red;
  text-decoration: underline;
  font-size: 0.85em;
  margin-top: 0.3rem;
  padding-left: 0.5rem;
  text-align: center;
  position: absolute;
`;

export const InputLabel = styled.label<FocusedField>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: ease-in .2s;

  &:focus-within ${InputTextLabel} {
    margin-top: -0.8rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    background-color: var(--whiteSuave);
    border-top: 2px solid var(--realce);
    border-left: 2px solid var(--realce);
    border-right: 2px solid var(--realce);
    color: var(--realce);
  }
`;

export const TextArea = styled.textarea`
    transition: ease-in 0.1s;
    padding: 0.5rem 0rem;
    border-radius: 10px;
    width: 100%;
    padding-left: 0.5rem;

    background-color: ${({ disabled }) => (disabled ? "#f5f5f5" : "#fff")}; 
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "text")}; 
    
    transition: ease-in .2s;

    height: 200px;
    resize: vertical; 

    &:focus {
      border: 2px solid var(--realce);
      background-color: var(--whiteSuave);
    }

    color: var(--realce);

    outline: none;
`;
