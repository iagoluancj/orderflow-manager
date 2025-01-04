export type TypeCliente = {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  created_at?: Date;
};

export type TypePedido = {
  id: number;
  cliente_id: string; 
  mesa: number; 
  status: 'cancelado' | 'aguard_aprovacao' | 'em_fila' | 'em_andamento' | 'pronto' | 'pedido_negado' | 'encerrado';
  created_at: Date;
  updated_at?: Date;
  aproved_by?: number; 
  itens?: { produto_preco: number; quantidade: number }[];

};

export type TypeItemPedido = {
  id: number;
  pedido_id: number;
  produto_id: number;
  quantidade: number;
  observacao?: string;
  produto_nome?: string;
  produto_preco?: number;
  created_at: Date;
  updated_at?: Date;
  aproved_by?: number; 
};

export type Produto = {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
  created_by?: number;
  updated_by?: number;
  deleted_by?: number;
}

export type TypeProduto = Produto[];

export type TypeCozinha = {
  id: number;
  pedido_id: number;
  status: 'em fila' | 'em andamento' | 'concluído' | 'finalizado';
  atualizado_por?: number;
  created_at: Date;
  updated_at?: Date;
};

export type TypeFuncionario = {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  is_admin: boolean;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
  created_by?: number;
  updated_by?: number;
  deleted_by?: number;
};

export interface CartItem extends Produto {
  quantidade: number; 
  observacao?: string;
}

export type TypeMesa = {
  id: number;
  name: string;
  capacity: number;
  style: React.CSSProperties;
};

export type TypeAssociacoes = {
  id: number;
  mesa_id: number;
  inicio_ocupacao: string; 
  fim_ocupacao: string; 
  usuario_id: string; 
  created_at: string; 
  updated_at: string; 
};