"use client";

import NavbarComponent from "@/Components/Navbar";
import Cardapio from "@/Components/Cardapio/page";
import { useContext } from "react";
import { SupaContext } from "@/Context";

export default function CardapioGarcom() {
    const { cart } = useContext(SupaContext);


    return (
        <>
            <NavbarComponent message='Garçom - Cardápio' isGarcom={true} cartQt={cart.length} />
            <Cardapio />
        </>
    );
}
