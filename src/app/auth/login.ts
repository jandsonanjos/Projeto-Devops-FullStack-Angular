import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Account } from '../app/services/account';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <h2>Login</h2>
        <div class="form-group">
          <label for="email">E-mail:</label>
          <input type="email" id="email" name="email" [(ngModel)]="email" required>
        </div>
        <div class="form-group">
          <label for="senha">Senha:</label>
          <input type="password" id="senha" name="senha" [(ngModel)]="senha" required>
        </div>
        <div *ngIf="error" class="error">{{ error }}</div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
    }
    .form-group input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .error {
      color: #ef4444;
      margin-bottom: 10px;
    }
    button {
      width: 100%;
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
  `]
})
export class LoginComponent {
  email = '';
  senha = '';
  error: string | null = null;

  constructor(private router: Router, private account: Account) {}

  onSubmit() {
    this.error = null;
    if (!this.email || !this.senha) {
      this.error = 'Preencha e-mail e senha.';
      return;
    }

    this.account.login(this.email, this.senha).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.error || 'Erro ao autenticar. Verifique suas credenciais.';
      }
    });
  }
}