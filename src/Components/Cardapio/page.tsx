"use client"
import { ButtonChamarGarcom, CatalogContainer, Categories, CategoriesContainer, CategoriesHeader, CategoriesList, CategoriesTitle, CategoryImage, CategoryItem, CategoryTitle, Header, HeaderContent, HeaderTexts, HeaderTitle, MenuContainer, MenuTitle, SearchBar, StyledInput } from "./styles";
import React, { createRef, RefObject, useContext, useEffect, useRef, useState } from "react";
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
import salada from '../../assets/salada.png'
import others from '../../assets/others.png'

import { SupaContext } from "@/Context";
import CategoryMenu from "./Produtos";

function getImageByCategory(category: string): StaticImageData {
  switch (category) {
    case "Massas":
      return massas;
    case "Pizzas":
      return pizzas;
    case "Salada":
      return salada;
    case "Carnes":
      return carnes;
    case "Hamburguer":
      return hamburguer;
    default:
      return others;
  }
}

export default function Cardapio() {
  const { cart, addItemToCart, removeItemFromCart } = useContext(SupaContext);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>([])
  const [items, setItems] = useState<TypeProduto>([]);
  const [selectedImage, setSelectedImage] = useState<StaticImageData | null>(null);
  const mesaId = Cookies.get("mesa");

  const refs = useRef<{ [key: string]: RefObject<HTMLHeadingElement> }>({});


  const handleImageClick = (image: StaticImageData) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const scrollToCategory = (category: string) => {
    refs.current[category]?.current?.scrollIntoView({ behavior: "smooth" });
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
    categories.forEach((category) => {
      refs.current[category] = refs.current[category] || createRef();
    });
  }, [categories]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/produtos/get");
        const data = await response.json();

        if (response.ok) {
          setItems(data.produtos);

          const uniqueCategories = [...new Set(data.produtos.map((item: Produto) => item.categoria))] as string[];
          setCategories(uniqueCategories);
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
                {categories.map((category) => (
                  <CategoryItem key={category} onClick={() => scrollToCategory(category)}>
                    <CategoryImage>
                      {/* Imagem associada à categoria */}
                      <Image src={getImageByCategory(category)} alt={`Icone de ${category}`} />
                    </CategoryImage>
                    <CategoryTitle>{category}</CategoryTitle>
                  </CategoryItem>
                ))}
              </CategoriesList>
            </CategoriesContainer>
          )
        }
        <MenuContainer>
          <MenuTitle>Cardápio</MenuTitle>

          {categories.map((category) => (
            <CategoryMenu
              key={category}
              title={category}
              category={category}
              filteredItems={filteredItems}
              cart={cart}
              addItemToCart={addItemToCart}
              removeItemFromCart={removeItemFromCart}
              handleImageClick={handleImageClick}
              refProp={refs.current[category]}
            />
          ))}

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