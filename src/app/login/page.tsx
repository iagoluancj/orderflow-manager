"use client"
import * as Form from "@radix-ui/react-form";
import { BGImage, Button, ErrorMessage, FormContainer, LoginContainer, LoginDiv, LoginHeader } from "./styles";
import logo from '../../assets/logo.png'
import Image from "next/image";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { SupaContext } from "@/Context";
import { TypeCliente } from "@/Types/types";
import InputComponent from "@/Components/Input";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import backgroundRestaurant from '../../assets/background.jpg'

export default function Login() {
  const { contextFuncionarios } = useContext(SupaContext)
  const [loading, setLoading] = useState(false)
  const [tokenSent, setTokenSent] = useState(true)
  const [isDisabled, setIsDisabled] = useState(true)
  const [isRequired, setIsRequired] = useState(true)
  const [formData, setFormData] = useState<TypeCliente>({
    nome: "",
    email: "",
    telefone: ""
  });
  const router = useRouter()


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('clicado')
    setLoading(true)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLoading(false);
      console.error("Formato de e-mail inválido.");
      toast.error("Por favor, insira um e-mail válido no formato values@values.values.");
      return;
    }

    const sanitizedTelefone = formData.telefone.replace(/\D/g, "");
    // if (sanitizedTelefone.length === 0) {
    //   setLoading(false);
    //   toast.error("Por favor, insira um telefone válido contendo apenas números.");
    //   return;
    // }

    if (formData.email) {
      const emailExists = contextFuncionarios.some(funcionario => funcionario.email === formData.email);
      console.log(emailExists, formData.email)

      if (emailExists) {
        const response = await fetch('/api/enviar-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        });

        const result = await response.json();

        setLoading(false)
        setTokenSent(false)
        setIsDisabled(true);
        setTimeout(() => {
          setIsDisabled(false)
        }, 5000);
        console.log(result)
        return
      } else {
        console.log('segue para o cadastro do cliente')
      }
    }

    if (sanitizedTelefone.length < 10 || sanitizedTelefone.length > 11) {
      setLoading(false);
      toast.error("Por favor, insira um telefone válido no formato: (00) 0 0000-0000.");
      return;
    }

    try {
      const response = await fetch('/api/clientes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, telefone: sanitizedTelefone }),
      });

      const result = await response.json();

      if (response.ok) {
        Cookies.set("user_id", result.cliente.id, { expires: 1, sameSite: 'strict' });
        setTimeout(() => {
          router.push('/auth/cliente');
        }, 10000);
        console.log('Cliente criado ou já existente:', result);
      } else {
        console.error('Erro ao criar ou verificar o cliente:', result.message);
      }
    } catch (error) {
      console.log('catch')
      console.error("Erro ao criar cliente:", error);

    } finally {
      console.log('finally')
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      const emailExists = contextFuncionarios.some(funcionario => funcionario.email === value);
      console.log(emailExists, value)

      if (emailExists) {
        setIsRequired(false);
        console.log('funcionario existente')

      } else {
        setIsRequired(true);
      }
    }

    if (name === "nome") {
      const filteredValue = value.replace(/[^a-zA-Z ]/g, "");
      setFormData((prevData) => ({
        ...prevData,
        [name]: filteredValue,
      }));
      return;
    }

    if (name === "telefone") {
      const numericValue = value.replace(/\D/g, "");
      const maskedValue = numericValue
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4,5})(\d{4})$/, "$1-$2");
      setFormData((prevData) => ({
        ...prevData,
        [name]: maskedValue,
      }));
      return;
    }


    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const backToLogin = () => {
    setTokenSent(true)
  }


  useEffect(() => {
    const userId = Cookies.get('user_id');

    if (userId) {
      router.push("/auth/cliente");
    }

    const checkAuthToken = async () => {
      const accessToken = Cookies.get('access_token');
      const email = Cookies.get('email_func');
      const userId = Cookies.get('user_id');

      if (accessToken && email) {
        const funcionario = contextFuncionarios.find(
          (funcionario) => funcionario.email === email
        );


        if (funcionario && funcionario.cargo) {
          let rota = '/error';
          if (funcionario.cargo === 'cozinha') {
            rota = "/auth/cozinha"
          } else if (funcionario.cargo === 'garcom') {
            rota = "/auth/garcom"
          } else {
            rota = '/error'
          }
          router.push(rota);
        }
      }

      if (userId) {
        router.push("/auth/cliente");
      }
    };

    const intervalId = setInterval(() => {
      checkAuthToken();
    }, 3000); 

    return () => clearInterval(intervalId);
  }, [contextFuncionarios, router]);

  return (
    <LoginContainer>
      {tokenSent ? (
        <LoginDiv>
          <Image src={logo} alt="Logo OrderFLow"></Image>
          <LoginHeader>
            <h1>Seja bem vindo(a)</h1>
            <p>Realize o login para iniciar seu pedido</p>
          </LoginHeader>
          <Form.Root className="FormRoot" onSubmit={handleSubmit}>
            <FormContainer>
              <InputComponent
                label="Seu nome: "
                maxLength={100}
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required={isRequired}
              />
              <InputComponent
                label="Seu e-mail: "
                maxLength={100}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required={isRequired}
              />
              <InputComponent
                label="Seu telefone: "
                maxLength={20}
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                required={isRequired}

              />
            </FormContainer>
            <button disabled={loading} type="submit" className="Button" style={{ marginTop: 30 }}>
              {loading ? `Carregando` : `Login`}
            </button>
          </Form.Root>
        </LoginDiv>
      ) : (
          <LoginDiv>
            {/* shouldAnimate={animate} */}
            <LoginHeader >
              <div>
                <Image alt='Logo' src={logo} />
              </div>
              <h1>Email enviado</h1>
              <p>Verifique sua caixa de email</p>
              <div>
                <ErrorMessage>Email enviado com sucesso.</ErrorMessage>
                <Button disabled={isDisabled} onClick={backToLogin}>Enviar email novamente</Button>
              </div>
            </LoginHeader>
          </LoginDiv>
      )
      }
      <BGImage>
        <Image src={backgroundRestaurant} alt="Imagem ilustrativa do restaurant"></Image>
      </BGImage>
    </LoginContainer>
  );
}
