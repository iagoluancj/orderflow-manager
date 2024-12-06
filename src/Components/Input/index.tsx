import { ChangeEvent, useEffect, useState } from "react";
import { DivInput, InputError, InputInput, InputLabel, InputTextLabel, TextArea } from "./styles";

// Componente primitivo, criado por mim e tem sido oque venho utilizando em minhas aplicações. 

interface InputComponentProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    type?: string;
    required?: boolean;
    disabled?: boolean;
    height?: number;
    suggestions?: string[]
    errorinput?: boolean; 
    errorMessage?: string; 
    maxLength?: number;
}

export default function InputComponent({
    label,
    name,
    value,
    onChange,
    maxLength = 0,
    type = "text",
    required = false,
    disabled = false,
    height = 0,
    suggestions = [],
    errorinput = false, 
    errorMessage = ""
}: InputComponentProps) {
    const [isTrue, setIsTrue] = useState(false);

    useEffect(() => {
        const hasValue = value.length > 0;
        setIsTrue(hasValue);
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        onChange(e);
    };

    const processedSuggestions = Array.isArray(suggestions) ? suggestions : [];

    if (type === "textarea") {
        return (
            <DivInput>
                <InputLabel $focusField={false}>
                    <InputTextLabel $focusField={isTrue}>{label}</InputTextLabel>
                    <TextArea
                        name={name}
                        value={value}
                        onChange={handleChange}
                        required={required}
                        disabled={disabled}
                        style={{ height: `${height}px` }}
                    />
                </InputLabel>
            </DivInput>
        );
    }

    return (
        <DivInput>
            <InputLabel $focusField={false}>
                <InputTextLabel $focusField={isTrue}>{label}</InputTextLabel>
                {errorinput && <InputError className="error-message">{errorMessage}</InputError>}
                <InputInput
                    list={`${name}-list`}
                    type={type}
                    name={name}
                    value={value}
                    required={required}
                    disabled={disabled}
                    maxLength={maxLength}
                    onChange={handleChange}
                />
                <datalist id={`${name}-list`}>
                    {processedSuggestions.map((suggestion, index) => (
                        <option key={index} value={suggestion}>
                            {suggestion}
                        </option>
                    ))}
                </datalist>
            </InputLabel>
        </DivInput>
    );
}
