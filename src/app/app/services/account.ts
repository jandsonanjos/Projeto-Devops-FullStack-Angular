import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

const API_URL = 'http://localhost:3000/api';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  saldo?: number;
}

interface AuthResponse {
  usuario: Usuario;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class Account {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.carregarPerfil().subscribe();
    }
  }

  login(email: string, senha: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/login`, { email, senha })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.usuarioSubject.next(response.usuario);
        })
      );
  }

  registro(usuario: { nome: string, email: string, senha: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/register`, usuario)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.usuarioSubject.next(response.usuario);
        })
      );
  }

  carregarPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${API_URL}/usuario`)
      .pipe(
        tap(usuario => {
          this.usuarioSubject.next(usuario);
        })
      );
  }

  atualizarPerfil(dados: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${API_URL}/usuario`, dados)
      .pipe(
        tap(usuario => {
          this.usuarioSubject.next(usuario);
        })
      );
  }

  // Novo: obter saldo do usuário
  getSaldo(): Observable<{ saldo: number }> {
    return this.http.get<{ saldo: number }>(`${API_URL}/saldo`);
  }

  // Novo: obter extrato/transações do usuário
  getExtrato(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/extrato`);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.usuarioSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
