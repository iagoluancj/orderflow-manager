"use client"
import { ButtonChamarGarcom, CatalogContainer, Categories, CategoriesContainer, CategoriesHeader, CategoriesList, CategoriesTitle, CategoryImage, CategoryItem, CategoryTitle, H3, Header, HeaderContent, HeaderTexts, HeaderTitle, MenuContainer, MenuItem, MenuItemDescription, MenuItemDetails, MenuItemImage, MenuItemPrice, MenuItemQuantity, MenuItemQuantityContainer, MenuItemTitle, MenuList, MenuTitle, SearchBar, SpanAdd, StyledInput } from "./styles";
import { useContext, useEffect, useRef, useState } from "react";
import { Produto, TypeProduto } from "@/Types/types";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import { FaConciergeBell } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import logoWaiter from '../../assets/logoWaiter.png'
import Image, { StaticImageData } from "next/image";

import carnes from '../../assets/Carnes.png'
import massas from '../../assets/massas.png'
import pizzas from '../../assets/Pizza.png'
import hamburguer from '../../assets/hamburguer.png'
import others from '../../assets/others.png'

import itemHamburguer from '../../assets/item.jpg'
import itemPizza from '../../assets/pizza.jpg'
import itemSalada from '../../assets/salada.jpg'

import { SupaContext } from "@/Context";
import { IoIosAdd, IoIosRemove } from "react-icons/io";

const imageMap: { [key: string]: StaticImageData } = {
  'Hamburguer': itemHamburguer,
  'Pizza Margherita': itemPizza,
  'Salada Caesar': itemSalada,
};


export default function Cardapio() {
  const { cart, addItemToCart, removeItemFromCart } = useContext(SupaContext);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<TypeProduto>([]);
  const [selectedImage, setSelectedImage] = useState<StaticImageData | null>(null);
  const massasRef = useRef<HTMLHeadingElement>(null);
  const mesaId = Cookies.get("mesa");

  const handleImageClick = (image: StaticImageData) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const scrollToMassas = () => {
    massasRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const callWaiter = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
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
      setTimeout(() => setLoading(false), 1500);
    }
  };

  const filteredItems = items.filter((item) =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Header>
        <HeaderContent>
          <HeaderTexts>
            <Image src={logoWaiter} alt="Logo Waiter"></Image>
            <div>
              <h2>Bem-vindo! </h2>
              <HeaderTitle>O que deseja saborear hoje?</HeaderTitle>
            </div>
          </HeaderTexts>
          <SearchBar>
            <span><CiSearch size={30} /></span>
            <StyledInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquise oque você deseja" />
          </SearchBar>
        </HeaderContent>
      </Header>

      <Categories>
        {
          searchTerm || filteredItems.length === 0 ? (
            <span></span>
          ) : (
            <CategoriesContainer>
              <CategoriesHeader>
                <CategoriesTitle> Categorias </CategoriesTitle>
              </CategoriesHeader>
              <CategoriesList>
                <CategoryItem onClick={scrollToMassas}>
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
                  <CategoryImage><Image src={hamburguer} alt="Icone de hamburguer"></Image></CategoryImage>
                  <CategoryTitle>Hamburguer</CategoryTitle>
                </CategoryItem>
                <CategoryItem>
                  <CategoryImage><Image src={others} alt="Icone de outros"></Image></CategoryImage>
                  <CategoryTitle>Outros</CategoryTitle>
                </CategoryItem>
              </CategoriesList>
            </CategoriesContainer>
          )
        }
        <MenuContainer>
          <MenuTitle>Cardápio</MenuTitle>
          <H3>Preferidos</H3>
          <MenuList >
            {filteredItems.length === 0 ? (
              <div
                style={{
                  padding: '1rem',
                }}
              >Nenhum resultado encontrado para {`"Preferidos"`}. Que tal explorar outras opções deliciosas?</div>
            ) : (
              filteredItems.map((item: Produto) => {
                const cartItem = cart.find((cartItem) => cartItem.id === item.id);
                const itemImage = imageMap[item.nome] || '';

                return (
                  <MenuItem key={item.id}>
                    <MenuItemImage><Image src={itemImage} alt={`Image item ${item.nome}`} onClick={() => handleImageClick(itemImage)}></Image></MenuItemImage>
                    <MenuItemDetails>
                      <MenuItemTitle>{item.nome}</MenuItemTitle>
                      <MenuItemDescription>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.</MenuItemDescription>
                      <MenuItemQuantityContainer>
                        <MenuItemQuantity> <SpanAdd onClick={() => removeItemFromCart(item.id)}> <IoIosRemove />   </SpanAdd>{cartItem ? cartItem.quantidade.toString().padStart(2, '0') : '00'}<SpanAdd onClick={() => addItemToCart(item)}> <IoIosAdd /> </SpanAdd></MenuItemQuantity>
                        <MenuItemPrice>
                          R$ {Number(item.preco).toFixed(2).replace('.', ',')} Un.
                        </MenuItemPrice>
                      </MenuItemQuantityContainer>
                    </MenuItemDetails>
                  </MenuItem>
                )
              })
            )}
          </MenuList>
          <H3 ref={massasRef}>Massas</H3>
          <MenuList>
            {filteredItems.length === 0 ? (
              <div
                style={{
                  padding: '1rem',
                }}
              >Nenhum resultado encontrado para {`"Massas"`}. Que tal explorar outras opções deliciosas?</div>
            ) : (
              filteredItems.map((item: Produto) => {
                const cartItem = cart.find((cartItem) => cartItem.id === item.id);
                const itemImage = imageMap[item.nome] || '';

                return (
                  <MenuItem key={item.id}>
                    <MenuItemImage><Image src={itemImage} alt={`Image item ${item.nome}`}></Image></MenuItemImage>
                    <MenuItemDetails>
                      <MenuItemTitle>{item.nome}</MenuItemTitle>
                      <MenuItemDescription>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </MenuItemDescription>
                      <MenuItemQuantityContainer>
                        <MenuItemQuantity> <SpanAdd onClick={() => removeItemFromCart(item.id)}> <IoIosRemove />   </SpanAdd>{cartItem ? cartItem.quantidade.toString().padStart(2, '0') : '00'}<SpanAdd onClick={() => addItemToCart(item)}> <IoIosAdd /> </SpanAdd></MenuItemQuantity>
                        <MenuItemPrice>
                          R$ {Number(item.preco).toFixed(2).replace('.', ',')} Un.
                        </MenuItemPrice>
                      </MenuItemQuantityContainer>
                    </MenuItemDetails>
                  </MenuItem>
                )
              })
            )}
          </MenuList>

        </MenuContainer>
      </Categories>

      <ButtonChamarGarcom onClick={callWaiter} disabled={loading} $isLoading={loading}>
        <FaConciergeBell size={24} />
        {loading ? "Aguarde.." : "Garçom"}
      </ButtonChamarGarcom>
      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <Image src={selectedImage} alt="Imagem ampliada" layout="responsive" />
          </div>
        </div>
      )}

      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          width: 100%;
          max-height: 100%;
        }
        .modal-content img {
          width: 100%;
          height: auto;
        }
      `}</style>

    </CatalogContainer>
  );
}
