import { Title } from "@/app/auth/cliente/styles";
import styled from "styled-components";

// Simples navbar; 

interface BorderStatus {
  $borderStatus: 'em_fila' | 'em_andamento' | 'pronto' | string;
}

export const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ec8609;
  padding: .5rem 1rem;
  width: 100%;
  color: white;

  position: sticky;
  top: 0rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

  z-index: 2;
`;

export const NavLogo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .2rem;

  img {
    max-width: 60px;
    border-radius: 50%;
  }
`;

export const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  gap: 1rem;
`;

export const NavLink = styled.span`
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  font-weight: 500;
  
  &:hover {
    color: #ddd;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: .3rem;
  position: relative; 
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background-color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 10;
  padding: 10px;
  width: 200px;
  border: 2px solid var(--realce);

  div {
    color: red;
  }
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 16px;

  color: #fff;
`;

export const ContainerItensQT = styled.span`
    position: relative; 
    display: inline-block;
`;

export const ItensQT = styled.span`
    position: absolute;
    top: -5px; 
    right: -5px; 
    background-color: red;
    color: white; 
    border-radius: 50%; 
    width: 15px;
    height: 15px; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    font-size: 12px; 
    font-weight: bold;
`;

export const ContainerMesaOpen = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 95%;
    max-width: 400px;
    padding: 20px;
    background-color: #00000099;
    border-radius: 15px;
    border: 1px solid var(--realce);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

    input {
      color: var(--backgroundPrimary);
  }
`

export const NavButton = styled.button`
    display: flex;
    gap: .5rem;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0rem;
    width: 100%;
    padding: 0.2rem .5rem;
    background: #ff6b6b;
    border: 1px solid transparent;
    color: var(--textoPrimario);
    border-radius: 5px;
    cursor: pointer;
    transition: .2s ease-out;
  
  &:hover {
    background-color: var(--textoPrimario);
    color: white;
    border: 1px solid #ff6b6b;
    color: #ff6b6b;

    transform: scale(1.05);

    transition: .2s ease-in;
  }
`;

export const NavButtonOrder = styled(NavButton)`
  background: var(--emAndamento);
&:hover {
  border: 1px solid var(--emAndamento);
  color: var(--emAndamento);
  }
`

export const NavButtonMesa = styled(NavButton)`
  background: var(--realce);
&:hover {
  border: 1px solid var(--realce);
  color: var(--realce);
  }
`

export const ButtonOpenCancel = styled(NavButton)`
  width: unset;
  margin: 1rem 0rem;
  border: 1px solid transparent;

&:hover {
    background-color: var(--textoPrimario);
    color: white;
    border: 1px solid #ff6b6b;
    color: #ff6b6b;

    transition: .2s ease-in;
  }
`

export const ButtonOpenConfirm = styled(NavButton)`
  width: unset;
  margin: 1rem 0rem; 
  border: 1px solid transparent !important;

&:hover {
    background: transparent !important;
    border: 1px solid #4CAF50 !important;
    color: #4CAF50 !important;
    transition: .2s ease-in;
  }

  &:disabled {
    cursor: not-allowed;
    background: #3c3c3c !important;
      border: 1px solid #3c3c3c !important;
      color: white !important;
      transition: .2s ease-in;
  }
`

export const ContainerButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  width: 100%;
`

export const CartOpenContainer = styled.div`
  position: fixed;
  top: 0; 
  left: 50%;
  transform: translateX(-50%); 
  width: 100vw;
  height: 100vh; 
  display: flex;
  justify-content: center;
  align-items: flex-start; 
  z-index: 10;
  padding: 1rem; 
  overflow-y: auto; 

  @media (max-height: 600px) {
    height: auto; 
    max-height: 100vh; 
    overflow-y: auto;
  }
`;


export const CartOpen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #472829 !important;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;

  /* border-top: solid 1px #f1a94e;
  border-left: solid 1px #f1a94e;
  border-right: solid 1px #f1a94e; */

  gap: 1.5rem;
`;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'em_fila':
      return 'var(--emFila)';
    case 'em_andamento':
      return 'var(--emAndamento)';
    case 'pronto':
      return 'var(--pronto)';
    default:
      return '#e5484d'; // Cor padrão
  }
};

export const OrdersContainer = styled.div<BorderStatus>`
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  justify-content: center;
  align-items: center;
  width: 100%;

  border-top: solid 1px ${({ $borderStatus }) => getStatusColor($borderStatus)};
  border-left: solid 1px ${({ $borderStatus }) => getStatusColor($borderStatus)};
  border-right: solid 1px ${({ $borderStatus }) => getStatusColor($borderStatus)};
  
  margin-bottom: .5rem;
  padding: .5rem;

  gap: 1.5rem;
`;

export const OrdersContainerFila = styled(OrdersContainer)`
  border-top: solid 1px var(--emFila);
  border-left: solid 1px var(--emFila);
  border-right: solid 1px var(--emFila);
`;

export const OrdersContainerAndamento = styled(OrdersContainer)`
  border-top: solid 1px var(--emAndamento);
  border-left: solid 1px var(--emAndamento);
  border-right: solid 1px var(--emAndamento);
`;

export const OrdersContainerProntos = styled(OrdersContainer)`
  border-top: solid 1px var(--pronto);
  border-left: solid 1px var(--pronto);
  border-right: solid 1px var(--pronto);
`;

export const Orders = styled.div`
  width: 100%;
`;

export const Order = styled.div`
  width: 100%;
  padding: 0rem .5rem;
  padding-top: .2rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;

  display: flex;
  flex-direction: column;
  align-items: start;

  /* border-top: solid 1px #e5484d;
  border-left: solid 1px #e5484d;
  border-right: solid 1px #e5484d; */

  border-radius: 15px;
  position: relative;
`;

export const OrderFila = styled(Order)`
  /* border-top: solid 1px #f1a94e;
  border-left: solid 1px #f1a94e;
  border-right: solid 1px #f1a94e; */
`;

export const TitleOrder = styled(Title)`
  font-size: 1rem;
  margin: 0;
`;

export const LiOrderItens = styled.li`
  font-size: 1rem;
  margin-left: 1rem;
`;


export const PedidoId = styled.p`
  position: absolute;
  top: -.6rem;
  right: 0;
  margin: 10px;
`;

export const ViewOrders = styled.button`
  width: 100%;
  padding: 0rem .5rem;
  border-radius: 12px;
  margin-top: .5rem;

  font-weight: 600;

  background-color: #f1a94e99;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

export const InputNewMesa = styled.input`
    color: var(--textoNeutro);
    outline: none;

    &::placeholder {
    color: var(--darkRed);
  }
`;
