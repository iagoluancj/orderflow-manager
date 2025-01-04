import styled from "styled-components"
import { ButtonOpenConfirm } from "../Navbar/styles"

export const TableContainer = styled.div`
    width: 100%;
    height: 400px;
    position: sticky;
    display: flex;
    justify-content: center;
    align-items: center;


    /* @media (max-width: 1048px) {
      overflow-x: scroll;
    } */
`
export const Tables = styled.div`
    /* display: flex;
    align-items: center;
    justify-content: center; */
    margin-top: 2rem;
    position: absolute; 
    overflow: auto;
    border-radius: 20px;

    img {
        /* width: 1000px; */
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
  gap: .5rem;
  align-items: center;
  justify-content: center;

  font-size: 12px !important;
  font-weight: 300 !important;
`
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
`
export const DivContainer = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;  
`

export const ButtonCallWaiter = styled.button`
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;  
      gap: 1rem;

      color: var(--realce);
`

export const ButtonProsseguir = styled(ButtonOpenConfirm)`
  width: unset;
  margin: 1rem 0rem; 
  border: 1px solid transparent !important;
`