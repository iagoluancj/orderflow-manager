import styled from "styled-components";

interface loading {
  $isLoading: boolean;
}

export const CatalogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Container = styled.div`
  display: grid;
  grid-template-rows: 20px 1fr 20px;
  place-items: center;
  min-height: 100vh;
  padding: 2rem;
  gap: 2rem;
  background: var(--backgroundPrimary);
  font-family: var(--font-geist-sans);
`;

export const Title = styled.h1`
  font-size: 2rem;
  color: var(--whiteSuave);
  text-align: start;
  font-weight: 600;

  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ButtonChamarGarcom = styled.button<loading>`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: sticky;
    bottom: 1rem;
    left: 100rem;
    margin-right: 2rem;

    padding: 1rem;

    border-radius: 50%;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #e5484d, #f1a94e);
    border-top: solid 1px white;
    border-left: solid 1px white;
    border-right: solid 1px white;

    ${({ $isLoading }) =>
    $isLoading &&
    `
      background: var(--whiteSuave);
      color: var(--realce);
      border-top: solid 1px #f1a94e;
      border-left: solid 1px #f1a94e;
      border-right: solid 1px #f1a94e;
  `}
`;

export const MenuContainerWrapper = styled.div`
  display: flex;
  gap: 2rem;
`;

export const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: flex-start;
  overflow-x: auto;  
  overflow-y: hidden;  
  max-width: 1200px;
  width: 100%;
  padding: 1rem 0;
  white-space: nowrap;

  &::-webkit-scrollbar {
        height: 7px;
        cursor: pointer;
      }
      &::-webkit-scrollbar-track {
        background-color: #2c2c2c; 
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--realce); 
        border-radius: 10px;
        border: 1px solid #2c2c2c; 
      }

      &::-webkit-scrollbar-thumb:hover {
        background-color: var(--realceHover); 
        cursor: pointer;
      }

`;

export const Card = styled.div`
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 250px;
  padding: .5rem;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
`;

export const CardTitle = styled.h2`
  font-size: 1.5rem;
  margin: 1rem 0;
  margin-bottom: .4rem;
  color: #333;
`;

export const CardDescription = styled.p`
  font-size: .7rem;
  margin: 1rem 0;
  margin-bottom: .4rem;
  color: #333;
  word-wrap: break-word; 
  overflow-wrap: break-word; 
  white-space: normal; 
`;

export const CardPrice = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #e63946;
`;

export const Seila = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0rem;
  span {
    color: red;
  }
`;

export const OrderButton = styled.button`
  background-color: #e63946;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d62828;
  }
`;

export const Header = styled.header`
  width: 100%;
  background: var(--backgroundPrimary);
  text-align: start !important;
`;

export const HeaderContent = styled.div`
  background: linear-gradient(135deg, #e5484d, #f1a94e);
  width: 100%;
  padding: 1rem 2rem;
  padding-top: 2.5rem;


  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  text-align: start;

  h2 {
    font-size: 1rem;
    color: var(--whiteSuave);
    text-align: start;
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 1.2rem;
  color: var(--whiteSuave);
  text-align: start;
`;

export const HeaderTexts = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1rem;
  gap: .5rem;
  color: var(--whiteSuave);

  img {
    width: 80px;
  }
`;

export const HeaderDescription = styled.p`
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: -2rem;
  width: 100%;
  max-width: 500px;
  gap: 0.3rem; 
  padding: 0rem; 
  border: 1px solid #ccc; 
  border-radius: 8px; 
  background-color: var(--whiteSuave); 

  div, span {
    color: #ccc;
    padding-left: .2rem;
  }
`;

export const StyledInput = styled.input`
  flex: 1; 
  border: none; 
  outline: none; 
  color: #0f0f0f99;
  padding: 0.5rem; 
  border-radius: 8px;
  font-size: 1rem;
`;

export const Categories = styled.div`
  max-width: 1200px;
  margin-top: 2rem;
  gap: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const CategoriesContainer = styled.div`
  padding: 0rem 2rem;
  display: flex;
  flex-direction: column;
  max-width: 500px;

  @media (max-width: 600px) {
    max-width: 400px;
  }`;

export const CategoriesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0rem .3rem;
`;

export const CategoriesTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
`;

export const ViewMore = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  font-weight: 200;

  span {
    font-size: 1.8rem;
    margin-top: -5px;
  }
`;

export const H3 = styled.h3`
  font-weight: 500;
  color: var(--realce);
`;

export const CategoriesList = styled.div`
  display: flex;
  padding: 1rem;
  width: 100%;
  gap: 2rem;

  overflow-x: scroll;

  &::-webkit-scrollbar {
    height: 5px;  
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;  
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #f1a94e;  
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #e08b3b; 
    cursor: pointer; 
  }
`;

export const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 1rem;
  height: 110px;
  width: 100px;
  border-radius: 8px;
  border: 1px solid var(--whiteSuave);
  gap: .8rem;

  cursor: pointer;
`;

export const CategoryImage = styled.div`
  img {
    max-width: 50px;
    max-height: 50px;
  }
`;

export const CategoryTitle = styled.h4``;

export const MenuContainer = styled.div`
  padding: 0rem 2rem;
  display: flex;
  flex-direction: column;

  max-width: 500px;
`;

export const MenuTitle = styled.h3`
    font-size: 1.3rem;
    font-weight: 600;
`;

export const MenuList = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const MenuItem = styled.div`
  border-radius: 10px;
  border: 1px solid var(--whiteSuave);

  display: flex;
  align-items: stretch;
`;

export const MenuItemImage = styled.div`
  flex: 0 0 auto;
  border-radius: 15px;
  img {
    object-fit: cover; 
  height: 100%;     
  width: auto;  
  border-radius: 10px 0px 0px 10px;

  }
`;

export const MenuItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  gap: .5rem;
  overflow: hidden;       
  text-overflow: ellipsis; 

  padding: .5rem;
`;

export const MenuItemTitle = styled.h4`
  font-weight: 700;
  font-size: 1.4rem;
`;

export const MenuItemDescription = styled.div`
  line-height: 1.1;
`;

export const MenuItemQuantityContainer = styled.div`
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;

    @media (max-width: 390px) {
      flex-wrap: wrap-reverse;
      align-items: center;
      justify-content: center; 
      gap: .2rem;
    }
`;

export const MenuItemQuantity = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: .5rem;
  
`;

export const MenuItemPrice = styled.span`
`;

export const SpanAdd = styled.button`
  padding: .1rem .5rem;
  border-radius: 15px;
  background-color: var(--realce);
  cursor: pointer;

  svg {
    color: black;
  }
`;