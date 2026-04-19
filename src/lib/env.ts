const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(
      `Variável de ambiente obrigatória não definida: ${key}\n` +
        `Adicione-a em .env.local (desenvolvimento) ou nas Environment Variables da Vercel (produção).`
    );
  }
}

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
};
