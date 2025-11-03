import { Component } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode';

interface ContaBancaria {
  banco: string;
  agencia: string;
  conta: string;
  tipo: 'corrente' | 'poupanca';
  titular: string;
  cpf: string;
}

@Component({
  selector: 'app-saldo',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe, FormsModule],
  templateUrl: './saldo.html',
  styleUrls: ['./saldo.css']
})

export class Saldo {
  saldo: number = 5234.67;
  ultimaAtualizacao: Date = new Date();
  limitePix: number = 5000;
  limiteTransferencia: number = 10000;
  
  // Variáveis para o modal do PIX
  showPixModal = false;
  qrCodeImage: string = '';
  valorPix: number = 0;
  pixCopiaECola: string = '';

  // Variáveis para o modal de transferência
  showTransferenciaModal = false;
  valorTransferencia: number = 0;
  contaDestino: ContaBancaria = {
    banco: '',
    agencia: '',
    conta: '',
    tipo: 'corrente',
    titular: '',
    cpf: ''
  };
  
  constructor(private router: Router) { }

  navegarParaExtrato() {
    this.router.navigate(['/extrato']);
  }

  async gerarPix() {
    this.showPixModal = true;
    if (this.valorPix > 0 && this.valorPix <= this.limitePix) {
      // Simulando dados do PIX (em produção, isso viria do backend)
      const pixData = {
        chave: "jandsonboyzinholindo@hotmail.com",
        valor: this.valorPix,
        beneficiario: "Nome do Beneficiário",
        banco: "Banco Exemplo",
        timestamp: new Date().toISOString()
      };

      // Gerar string do PIX (em produção, isso seguiria o padrão oficial do BACEN)
      const pixString = JSON.stringify(pixData);
      this.pixCopiaECola = pixString;

      try {
        // Gerar QR Code
        this.qrCodeImage = await QRCode.toDataURL(pixString);
      } catch (err) {
        console.error('Erro ao gerar QR Code:', err);
      }
    }
  }

  fecharModalPix() {
    this.showPixModal = false;
    this.qrCodeImage = '';
    this.valorPix = 0;
  }

  copiarPix() {
    navigator.clipboard.writeText(this.pixCopiaECola)
      .then(() => alert('Código PIX copiado com sucesso!'))
      .catch(err => console.error('Erro ao copiar:', err));
  }

  // Métodos para transferência
  abrirModalTransferencia() {
    this.showTransferenciaModal = true;
  }

  fecharModalTransferencia() {
    this.showTransferenciaModal = false;
    this.valorTransferencia = 0;
    this.contaDestino = {
      banco: '',
      agencia: '',
      conta: '',
      tipo: 'corrente',
      titular: '',
      cpf: ''
    };
  }

  formatarCPF(event: any) {
    let cpf = event.target.value.replace(/\D/g, ''); // Remove não dígitos
    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      this.contaDestino.cpf = cpf;
    }
  }

  validarTransferencia(): boolean {
    return Boolean(
      this.valorTransferencia > 0 &&
      this.valorTransferencia <= this.limiteTransferencia &&
      this.valorTransferencia <= this.saldo &&
      this.contaDestino.banco &&
      this.contaDestino.agencia &&
      this.contaDestino.conta &&
      this.contaDestino.titular &&
      this.contaDestino.cpf.length === 14 // CPF formatado tem 14 caracteres
    );
  }

  realizarTransferencia() {
    if (this.validarTransferencia()) {
      // Aqui você implementaria a chamada real ao backend
      // Por enquanto, vamos apenas simular a transferência
      this.saldo -= this.valorTransferencia;
      this.ultimaAtualizacao = new Date();
      
      alert('Transferência realizada com sucesso!');
      this.fecharModalTransferencia();
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }
}