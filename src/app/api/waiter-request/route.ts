let solicitacoes: { mesaId: string; timestamp: number }[] = [];

export async function POST(req: Request) {
  const { mesaId } = await req.json();

  if (!mesaId) {
    return new Response(JSON.stringify({ error: 'Mesa não especificada.' }), { status: 400 });
  }

  solicitacoes.push({ mesaId, timestamp: Date.now() });

  return new Response(JSON.stringify({ message: 'Solicitação registrada com sucesso.' }), { status: 200 });
}

export async function GET() {
  return new Response(JSON.stringify(solicitacoes), { status: 200 });
}

export async function DELETE(req: Request) {
  const { mesaId } = await req.json();

  if (!mesaId) {
    return new Response(JSON.stringify({ error: 'Mesa não especificada.' }), { status: 400 });
  }

  solicitacoes = solicitacoes.filter((s) => s.mesaId !== mesaId);

  return new Response(JSON.stringify({ message: 'Solicitações removidas com sucesso.' }), { status: 200 });
}
