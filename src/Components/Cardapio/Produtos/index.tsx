import React, { RefObject } from 'react';
import { H3, MenuItem, MenuItemDescription, MenuItemDetails, MenuItemImage, MenuItemPrice, MenuItemQuantity, MenuItemQuantityContainer, MenuItemTitle, MenuList, SpanAdd } from '../styles';
import Image, { StaticImageData } from 'next/image';
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { CartItem, Produto } from '@/Types/types';
import { imageMap } from './images';

type Props = {
    title: string;
    category: string;
    filteredItems: Produto[];
    cart: CartItem[];
    addItemToCart: (item: CartItem) => void;
    removeItemFromCart: (id: number) => void;
    handleImageClick: (image: StaticImageData) => void;
    refProp: RefObject<HTMLHeadingElement>;
};

const CategoryMenu: React.FC<Props> = ({
    title,
    category,
    filteredItems,
    cart,
    addItemToCart,
    removeItemFromCart,
    handleImageClick,
    refProp
}) => {
    return (
        <>
            <H3 ref={refProp}>{title}</H3>
            <MenuList>
                {filteredItems.length === 0 ? (
                    <div style={{ padding: '1rem' }}>
                        Nenhum resultado encontrado para {`"${title}"`}. Que tal explorar outras opções deliciosas?
                    </div>
                ) : (
                    filteredItems
                        .filter((item) => item.categoria === category)
                        .map((item: Produto) => {
                            const cartItem = cart.find((cartItem) => cartItem.id === item.id);
                            const itemImage = imageMap[item.nome] || '';

                            return (
                                <MenuItem key={item.id}>
                                    <MenuItemImage>
                                        <Image
                                            src={itemImage}
                                            alt={`Image item ${item.nome}`}
                                            onClick={() => handleImageClick(itemImage)}
                                        />
                                    </MenuItemImage>
                                    <MenuItemDetails>
                                        <MenuItemTitle>{item.nome}</MenuItemTitle>
                                        <MenuItemDescription>
                                            {item.descricao}
                                        </MenuItemDescription>
                                        <MenuItemQuantityContainer>
                                            <MenuItemQuantity>
                                                <SpanAdd onClick={() => removeItemFromCart(item.id)}>
                                                    <IoIosRemove />
                                                </SpanAdd>
                                                {cartItem ? cartItem.quantidade.toString().padStart(2, '0') : '00'}
                                                <SpanAdd onClick={() => addItemToCart(item)}>
                                                    <IoIosAdd />
                                                </SpanAdd>
                                            </MenuItemQuantity>
                                            <MenuItemPrice>
                                                R$ {Number(item.preco).toFixed(2).replace('.', ',')} Un.
                                            </MenuItemPrice>
                                        </MenuItemQuantityContainer>
                                    </MenuItemDetails>
                                </MenuItem>
                            );
                        })
                )}
            </MenuList>
        </>
    );
};

export default CategoryMenu;
