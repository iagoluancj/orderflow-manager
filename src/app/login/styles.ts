import styled from "styled-components";
import "@radix-ui/colors/black-alpha.css";
import "@radix-ui/colors/violet.css";
import "@radix-ui/colors/mauve.css";

export const LoginHeader = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center; 

    h1 {
        font-size: 24px;
        font-weight: 600;
    }

    p {
		text-align: center;
        padding: 0rem 2rem;
    }
`

export const LoginContainer = styled.div`
    padding: 1rem;
    gap: 2rem;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    z-index: 10;
    
    color: var(--emFila);

    background: linear-gradient(135deg, #3f3f3f, #e5484d, #f1a94e, #ec8609);

   img {
        border-radius: 50%;
        width: 150px;
        padding-bottom: 1rem;
   }

   @media (max-width: 1200px) {
        background: none;
    }

/* reset */
.FormRoot {
	width: 260px;
}

.FormField {
	display: grid;
	margin-bottom: 10px;
}

.FormLabel {
	font-size: 15px;
	font-weight: 700;
	line-height: 35px;
    color: var(--emFila);
}

.FormMessage {
	font-size: 13px;
    color: var(--textoNeutro);
	opacity: 0.8;
    text-decoration: underline;
    text-decoration-color: var(--textoNeutro);
}

.Input,
.Textarea {
	width: 100%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	font-size: 15px;
    color: var(--textoNeutro);
	background-color: var(--black-a2);
	box-shadow: 0 0 0 1px var(--black-a6);
}

.Input:hover,
.Textarea:hover {
	box-shadow: 0 0 0 1px black;
}

.Input:focus,
.Textarea:focus {
	box-shadow: 0 0 0 2px black;
}

.Input::selection,
.Textarea::selection {
	background-color: var(--black-a6);
	color: white;
}

.Input {
	padding: 0 10px;
	height: 35px;
	line-height: 1;
}

.Textarea {
	resize: none;
	padding: 10px;
}

.Button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
	padding: 0 15px;
	font-size: 15px;
	line-height: 1;
	font-weight: 600;
	height: 45px;
	width: 100%;

	color: var(--whiteSuave);
	border: 1px solid transparent;
	background: linear-gradient(135deg, #e5484d, #f1a94e);

    transition: .2s ease;   
}

.Button:hover {
    transition: .2s ease;
    transform: scale(1.05);
    box-shadow: 0 2px 10px var(--black-a4);
	background: var(--whiteSuave);
	color: var(--realce);
    border: 1px solid var(--emFila);
    cursor: pointer;
}

.Button:focus {
	box-shadow: 0 0 0 2px black;
}
`

export const LoginDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 1rem 1rem;
    margin-right: 40rem;
    background-color: var(--darkRed);
    /* background-color: #00000099; */
    border-radius: 15px;
    border: 1px solid var(--realce);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);

    @media (max-width: 1200px) {
        margin-right: 0rem;
        z-index: 10;
    }
`

export const FormContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.3rem;
`

export const ErrorMessage = styled.div`
    color: #68ff86;
	margin: 2rem 0rem;
`;

export const LoginContainerSent = styled(LoginContainer)`
	p {
		color: #a06115;
	}
`

export const Button = styled.button`
  background: linear-gradient(135deg, #e5484d, #f1a94e);
  color: #fff;
  border: none;
  padding: 8px 16px;
  margin: 4px;
  cursor: pointer;
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #fff;

  &:hover {
    background: transparent;
    border: 1px solid var(--realce);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    color: #f1a94e;
  }

  &:disabled {
    background-color: #00000050;
    border: 1px solid transparent;
    box-shadow: 0px 0px 0px 0px rgb(0, 0, 0, 0);
	cursor: not-allowed;
  }
`;

export const BGImage = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;

  img {
    all: unset;
    width: 100%;
    height: 100%; 
    object-fit: cover; 
    max-height: none; 
  }

  @media (max-width: 1200px) {
    width: 100%;
    position: absolute;
    opacity: .2;

    img {
      position: unset;
      width: 100%;
      height: 100%; 
      object-fit: cover;
      object-position: center;
    }
  }
`;