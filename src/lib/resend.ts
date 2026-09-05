import { Resend } from "resend";

// A instância só é usada quando um email é realmente enviado (src/lib/email.ts),
// que já trata falha de envio/chave ausente com try/catch + log em EmailLog — por
// isso o construtor não pode lançar aqui mesmo sem chave configurada (a classe
// Resend lança se receber uma string vazia).
export const resend = new Resend(process.env.RESEND_API_KEY || "re_not_configured");
