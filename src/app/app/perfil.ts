import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account } from '../app/services/account';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="perfil-container">
      <div class="perfil-header">
        <h1>Gerenciar Conta</h1>
        <p>Atualize suas informações pessoais</p>
      </div>

      <div class="perfil-content">
        <div class="perfil-section">
          <h2>Informações Pessoais</h2>
          
          <div class="form-group">
            <label for="nome">Nome Completo</label>
            <input type="text" id="nome" [(ngModel)]="usuario.nome" class="form-control">
          </div>
          
          <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" [(ngModel)]="usuario.email" class="form-control">
          </div>

          <div class="form-group">
            <label for="telefone">Telefone</label>
            <input type="tel" id="telefone" [(ngModel)]="usuario.telefone" class="form-control">
          </div>
        </div>

        <div class="perfil-section">
          <h2>Segurança</h2>
          
          <div class="form-group">
            <label for="senha-atual">Senha Atual</label>
            <input type="password" id="senha-atual" [(ngModel)]="senhas.atual" class="form-control">
          </div>

          <div class="form-group">
            <label for="nova-senha">Nova Senha</label>
            <input type="password" id="nova-senha" [(ngModel)]="senhas.nova" class="form-control">
          </div>

          <div class="form-group">
            <label for="confirmar-senha">Confirmar Nova Senha</label>
            <input type="password" id="confirmar-senha" [(ngModel)]="senhas.confirmacao" class="form-control">
          </div>
        </div>

        <div class="perfil-actions">
          <button class="btn-secondary" (click)="cancelar()">Cancelar</button>
          <button class="btn-primary" (click)="salvar()">Salvar Alterações</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .perfil-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .perfil-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .perfil-header h1 {
      color: #1e88e5;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .perfil-header p {
      color: #64748b;
    }

    .perfil-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 8px;
    }

    .perfil-section h2 {
      color: #334155;
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #475569;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 1rem;
      color: #334155;
      transition: border-color 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #1e88e5;
    }

    .perfil-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #1e88e5;
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: #1976d2;
    }

    .btn-secondary {
      background: white;
      color: #64748b;
      border: 1px solid #e2e8f0;
    }

    .btn-secondary:hover {
      background: #f8fafc;
    }

    @media (max-width: 768px) {
      .perfil-container {
        padding: 1rem;
      }

      .perfil-actions {
        flex-direction: column;
      }

      .btn-primary, .btn-secondary {
        width: 100%;
      }
    }
  `]
})
export class PerfilComponent implements OnInit {
  usuario = {
    nome: '',
    email: '',
    telefone: ''
  };

  senhas = {
    atual: '',
    nova: '',
    confirmacao: ''
  };

  constructor(private account: Account) {}

  ngOnInit() {
    // Aqui você pode carregar os dados do usuário do backend
    this.account.carregarPerfil().subscribe({
      next: (u: any) => {
        this.usuario = {
          nome: u.nome || '',
          email: u.email || '',
          telefone: u.telefone || ''
        };
      },
      error: (err) => {
        console.error('Erro ao carregar perfil:', err);
        // fallback para dados locais
        this.carregarDadosUsuario();
      }
    });
  }

  carregarDadosUsuario() {
    // Simular carregamento de dados do usuário
    // Aqui você deve fazer uma chamada para seu serviço de backend
    this.usuario = {
      nome: 'Usuário Exemplo',
      email: 'usuario@exemplo.com',
      telefone: '(11) 99999-9999'
    };
  }

  salvar() {
    // Validar senhas
    if (this.senhas.nova && this.senhas.nova !== this.senhas.confirmacao) {
      alert('As senhas não conferem!');
      return;
    }
    const payload: any = {
      nome: this.usuario.nome,
      email: this.usuario.email,
      telefone: this.usuario.telefone
    };

    if (this.senhas.nova) {
      payload.senha = this.senhas.nova;
    }

    this.account.atualizarPerfil(payload).subscribe({
      next: (u) => {
        alert('Alterações salvas com sucesso!');
        // limpar campos de senha
        this.senhas = { atual: '', nova: '', confirmacao: '' };
      },
      error: (err) => {
        console.error('Erro ao salvar perfil:', err);
        alert('Erro ao salvar alterações.');
      }
    });
  }

  cancelar() {
    // Recarregar dados originais
    this.carregarDadosUsuario();
    
    // Limpar senhas
    this.senhas = {
      atual: '',
      nova: '',
      confirmacao: ''
    };
  }
}