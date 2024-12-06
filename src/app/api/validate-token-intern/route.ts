import { NextRequest, NextResponse } from "next/server";

interface WaiterRequest {
    mesaId: string;
    timestamp: number;
}

let waiterRequests: WaiterRequest[] = [];

export async function GET() {
    return NextResponse.json(waiterRequests, { status: 200 });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { mesaId } = body;

        if (!mesaId) {
            return NextResponse.json(
                { message: "O campo 'mesaId' é obrigatório." },
                { status: 400 }
            );
        }

        waiterRequests.push({ mesaId, timestamp: Date.now() });
        return NextResponse.json(
            { message: "Garçom chamado com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: "Erro ao processar a requisição." },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    waiterRequests = [];
    return NextResponse.json(
        { message: "Chamadas limpas!" },
        { status: 200 }
    );
}
