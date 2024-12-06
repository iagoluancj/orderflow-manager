"use client"
import NavbarComponent from "@/Components/Navbar";
import { ButtonChamarGarcom, CatalogContainer, Categories, CategoriesContainer, CategoriesHeader, CategoriesList, CategoriesTitle, CategoryImage, CategoryItem, CategoryTitle, Header, HeaderContent, HeaderTexts, HeaderTitle, MenuContainer, MenuItem, MenuItemDescription, MenuItemDetails, MenuItemImage, MenuItemPrice, MenuItemQuantity, MenuItemQuantityContainer, MenuItemTitle, MenuList, MenuTitle, SearchBar, SpanAdd, StyledInput } from "./styles";
import { useContext, useEffect, useState } from "react";
import { Produto, TypeProduto } from "@/Types/types";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import { FaConciergeBell } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import logoWaiter from '../../assets/logoWaiter.png'
import Image from "next/image";

import carnes from '../../assets/Carnes.png'
import massas from '../../assets/massas.png'
import pizzas from '../../assets/Pizza.png'
import itemSeila from '../../assets/item.png'
import { SupaContext } from "@/Context";
import { IoIosAdd, IoIosRemove } from "react-icons/io";


export default function Cardapio() {
  const { cart, addItemToCart, removeItemFromCart } = useContext(SupaContext);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TypeProduto>([]);
  const mesaId = Cookies.get("mesa");


  const callWaiter = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/waiter-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mesaId }),
      });

      if (response.ok) {
        toast.success("Garçom chamado com sucesso!", {
          icon: false
        });
      } else {
        toast.error("Erro ao chamar o garçom.");
      }
    } catch (error) {
      console.error("Erro ao chamar o garçom:", error);
      toast.error("Erro ao se conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/produtos/get"); 
        const data = await response.json();

        if (response.ok) {
          setItems(data.produtos); 
        } else {
          console.error("Erro ao buscar produtos:", data.message);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    fetchProducts();

  }, []);

  return (
    <CatalogContainer>
      <NavbarComponent message='Carápio' cartQt={cart.length} />
      <Header>
        <HeaderContent>
          <HeaderTexts>
            <Image src={logoWaiter} alt="Logo Waiter"></Image>
            <div>
              <h2>Olá, </h2>
              <HeaderTitle>Oque escolheremos hoje?</HeaderTitle>
            </div>
          </HeaderTexts>
          <SearchBar>
            <span><CiSearch size={30} /></span>
            <StyledInput type="text" placeholder="Qual comida você está procurando?" />
          </SearchBar>
          {/* <HeaderDescription>
            Escolha, personalize e finalize seus pedidos sem complicações.
            Praticidade na palma da sua mão, enquanto você aproveita o que realmente importa.
          </HeaderDescription> */}
        </HeaderContent>
      </Header>

      <Categories>
        <CategoriesContainer>
          <CategoriesHeader>
            <CategoriesTitle> Categorias </CategoriesTitle>
            {/* <ViewMore>Ver mais <span>+</span></ViewMore> */}
          </CategoriesHeader>
          <CategoriesList>
            <CategoryItem>
              <CategoryImage><Image src={massas} alt="Icone de massas"></Image></CategoryImage>
              <CategoryTitle>Massas</CategoryTitle>
            </CategoryItem>
            <CategoryItem>
              <CategoryImage><Image src={pizzas} alt="Icone de massas"></Image></CategoryImage>
              <CategoryTitle>Pizzas</CategoryTitle>
            </CategoryItem>
            <CategoryItem>
              <CategoryImage><Image src={carnes} alt="Icone de massas"></Image></CategoryImage>
              <CategoryTitle>Carnes</CategoryTitle>
            </CategoryItem>
            <CategoryItem>
              <CategoryImage><Image src={massas} alt="Icone de massas"></Image></CategoryImage>
              <CategoryTitle>Hamburguer</CategoryTitle>
            </CategoryItem>
            <CategoryItem>
              <CategoryImage><Image src={massas} alt="Icone de massas"></Image></CategoryImage>
              <CategoryTitle>Outros</CategoryTitle>
            </CategoryItem>
            <CategoryItem>
              <CategoryImage><Image src={massas} alt="Icone de massas"></Image></CategoryImage>
              <CategoryTitle>Outros</CategoryTitle>
            </CategoryItem>
          </CategoriesList>
        </CategoriesContainer>
        <MenuContainer>
          <MenuTitle>Cardápio</MenuTitle>
          <h1>Preferidos</h1>
          <MenuList>
            {items.map((item: Produto) => {
              const cartItem = cart.find((cartItem) => cartItem.id === item.id);

              return (
                <MenuItem key={item.id}>
                  <MenuItemImage><Image src={itemSeila} alt={`Image item ${item.nome}`}></Image></MenuItemImage>
                  <MenuItemDetails>
                    <MenuItemTitle>{item.nome}</MenuItemTitle>
                    <MenuItemDescription>Delicioso hamburguer engana vegano, vai com duas carnes</MenuItemDescription>
                    <MenuItemQuantityContainer>
                      <MenuItemQuantity> <SpanAdd onClick={() => removeItemFromCart(item.id)}> <IoIosRemove />   </SpanAdd>{cartItem ? cartItem.quantidade.toString().padStart(2, '0') : '00'}<SpanAdd onClick={() => addItemToCart(item)}> <IoIosAdd /> </SpanAdd></MenuItemQuantity>
                      <MenuItemPrice>
                        R$ {Number(item.preco).toFixed(2).replace('.', ',')} Un.
                      </MenuItemPrice>
                    </MenuItemQuantityContainer>
                  </MenuItemDetails>
                </MenuItem>
              )
            })}
            {/* <MenuItem>
              <MenuItemImage><Image src={itemSeila} alt="Image item ${itemhere}"></Image></MenuItemImage>
              <MenuItemDetails>
                <MenuItemTitle>X-Salada</MenuItemTitle>
                <MenuItemDescription>Delicioso hamburguer engana vegano, vai com duas carnes</MenuItemDescription>
                <MenuItemQuantityContainer>
                  <MenuItemQuantity>- 1 +</MenuItemQuantity>
                  <MenuItemPrice>R$ 26,00</MenuItemPrice>
                </MenuItemQuantityContainer>
              </MenuItemDetails>
            </MenuItem>
            <MenuItem>
              <MenuItemImage><Image src={itemSeila} alt="Image item ${itemhere}"></Image></MenuItemImage>
              <MenuItemDetails>
                <MenuItemTitle>X-Salada Salada SaladaSalada</MenuItemTitle>
                <MenuItemDescription>Delicioso hamburguer engana  vegano, vai com duas carnes</MenuItemDescription>
                <MenuItemQuantityContainer>
                  <MenuItemQuantity>- 1 +</MenuItemQuantity>
                  <MenuItemPrice>R$ 26,00</MenuItemPrice>
                </MenuItemQuantityContainer>
              </MenuItemDetails>
            </MenuItem> */}
          </MenuList>
        </MenuContainer>
      </Categories>

      {/* <Container>
        <Title></Title>
        <MenuWrapper>
          <Title>Porções</Title>
          <MenuContainerWrapper>
            {items.map((item: Produto) => (
              <Card key={item.id}>
                <CardImage src={cardImage.src} alt={item.nome} />
                <CardTitle>{item.nome}</CardTitle>
                <CardDescription>Pow, não sei oq, maior detalhamento aqui, e tal ta ligado?</CardDescription>
                <CardPrice>R$ {item.preco}</CardPrice>
                <Seila>
                  <span>+</span>
                  <OrderButton onClick={() => addItemToCart(item)}>Adicionar ao Pedido</OrderButton>
                  <OrderButton onClick={() => removeItemFromCart(item.id)}>Remover</OrderButton>
                  <span>-</span>
                </Seila>
              </Card>
            ))}
          </MenuContainerWrapper>
        </MenuWrapper>
      </Container> */}

      <ButtonChamarGarcom onClick={callWaiter} disabled={loading}>
        <FaConciergeBell size={24} />
        {loading ? "Aguarde..." : "Garçom"}
      </ButtonChamarGarcom>

    </CatalogContainer>
  );
}
