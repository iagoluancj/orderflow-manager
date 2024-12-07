import styled from "styled-components";

// Simples navbar; 

export const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #e5484d, #f1a94e);
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
  background: var(--realceHover);
&:hover {
  border: 1px solid var(--realceHover);
  color: var(--realceHover);
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


&:hover {
    background-color: var(--textoPrimario);
    color: white;
    border: 1px solid #ff6b6b;
    color: #ff6b6b;

    transform: scale(1.01);

    transition: .2s ease-in;
  }
`

export const ButtonOpenConfirm = styled(NavButton)`
  width: unset;
  margin: 0rem 0rem;
  border: 1px solid transparent !important;

&:hover {
    background: transparent !important;
    border: 1px solid #4CAF50 !important;
    color: #4CAF50 !important;
    transform: scale(1.01);
    transition: .2s ease-in;
  }
`

export const CartOpenContainer = styled.div`
  position: fixed;
  top: 2rem;
  left: 0;
  width: 100vw;
  height: 100vw;
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items:center;
  z-index: 10;
`;

export const CartOpen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #472829 !important;

  border-top: solid 1px #f1a94e;
  border-left: solid 1px #f1a94e;
  border-right: solid 1px #f1a94e;

  gap: 1.5rem;
`;