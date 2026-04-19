import type { NextConfig } from "next";

const securityHeaders = [
  // Impede que a página seja carregada dentro de um iframe (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Impede que o browser "adivinhe" o tipo de conteúdo
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Não envia o referrer ao sair para domínios externos
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Força HTTPS por 1 ano (ativado apenas em produção pela Vercel)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Desabilita recursos desnecessários do browser
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Content Security Policy: restringe origens de scripts, estilos e conexões
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js precisa de inline scripts para hydration
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Permite conexão apenas com o próprio Supabase do projeto
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "img-src 'self' data: blob:",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
