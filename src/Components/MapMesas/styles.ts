import styled from "styled-components"
import { ButtonOpenConfirm, CartOpen, CartOpenContainer } from "../Navbar/styles"

export const TableContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    position: relative; 
`
export const Tables = styled.div`
    position: relative; 
    width: 100%;
    max-width: 800px; 
    height: auto;
    border-radius: 10px;

    img {
      width: 100%; 
        max-height: 70vh; 
        object-fit: contain; 
        border-radius: 15px;
        background-position: center;
    }

    .table-area {
        position: absolute;
        border: 2px solid rgba(0, 0, 0, 0.5);
        cursor: pointer;
        background: rgba(255, 255, 255, 0.2);
        transition: background-color 0.3s ease;
        transition: .2s ease-out;

        &:hover {
            background: #15ff0050;
            transform: scale(1.05);
            transition: .5s ease;
        }

        span {
            width: 100%;
            height: 50%;
            padding: .5rem 0rem;
            background-color: #44444499;
            border-radius: 0%;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
                p {
                  font-weight: bold;
                  font-size: 0%;
                  color: #fff;
                  margin: 0;
                  padding: 0;
                }
        }
    }
`
export const NameTable = styled.div`
  font-size: 12px !important;
  font-weight: bold !important;

  display: flex;
  flex-direction: column;
  gap: 0rem;
`
export const ChairSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: .1rem;
  align-items: center;
  justify-content: center;

  font-size: 12px !important;
  font-weight: bold !important;
`
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: left;
    padding: .5rem .5rem;
    padding-top: 1rem;
    width: 100%;

    h1 {
      font-size: 2rem;
      font-weight: bold;
      color: var(--realceHover);
      text-align: right;
      white-space: nowrap;
      overflow: hidden;
      border-right: 3px solid #FF6347; 
      animation: fadeSlideIn 1s ease-in-out;
    }

  @keyframes fadeSlideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
} 

  p {
    text-align: center;

    span {
      display: inline-block;
      opacity: 0;
      transform: translateY(20px);
      animation: wave 0.8s ease-in-out forwards;
  }
  }

  p span:nth-child(1) { animation-delay: 0.1s; }
  p span:nth-child(2) { animation-delay: 0.2s; }
  p span:nth-child(3) { animation-delay: 0.3s; }
  p span:nth-child(4) { animation-delay: 0.4s; }

@keyframes wave {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`
export const DivContainer = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;  
`
export const ButtonCallWaiter = styled.button`
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;  
      gap: .5rem;
      margin-top: 1rem;

      color: var(--realce);
`
export const ButtonProsseguir = styled(ButtonOpenConfirm)`
  width: unset;
  margin: 2rem 0rem;
  background-color: var(--realce);
  border: 1px solid transparent !important;

  box-shadow: 0px 4px 6px #f1a94e30;
`
export const Description = styled.div`
      display: flex;
      align-items: center;
      gap: .2rem;

    strong {
      display: inline-flex;
      align-items: center;
      gap: .1rem;
    }

    i {
      font-size: .8rem;
    }
`
export const DescriptionCores = styled(Description)`
  text-align: justify;
`
export const InputChair = styled.input`
  padding: 4px;
  margin: 10px 0;
  border: 1px solid #ccc;
  outline: none;
  border-radius: 4px;
  width: 100%;
  color: #232323;

  &::placeholder {
    color: #232323;
  }
`
export const ButtonDescriptionDuvida = styled.button`
  display: flex;
  align-items: center; 
  justify-content: space-between;
  gap: .2rem;
  color: #fff;  
  box-shadow: 0px 4px 6px #f1a94e30;
  padding: 0px 10px;  
  border-radius: 5px; 
  cursor: pointer;
  width: 100%;
  max-width: 500px;
  
  
    span {
      display: flex;
      align-items: center;
      gap: .5rem;
    }
`
export const DescriptionDuvidaContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: .5rem;
  width: 100%;
  max-width: 500px;

  padding: 0.2rem 1rem 1rem 1rem;
`
export const DescriptionDuvida = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  background: #3f3f3f;
  border-top: 1px solid var(--realce);
  border-left: 1px solid var(--realce);
  border-right: 1px solid var(--realce);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 15px;
  z-index: 10;
`
export const ConfirmMesaContainer = styled(CartOpenContainer)`
`
export const ConfirmMesa = styled(CartOpen)`
  background-color: #3F3F3F;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
`
export const ButtonsActionContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`
export const FilterChairContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  gap: 1rem;
`
export const FindMesas = styled.div`
  position: absolute;
  top: 3.8rem;
  right: 1.2rem;
  font-size: 0.9rem;
`

