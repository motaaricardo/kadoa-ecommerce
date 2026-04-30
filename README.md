# Kadoa Sourires & Souvenirs — E-commerce

Site e-commerce profissional para [www.kadoa.ch](https://www.kadoa.ch) — personalização artesanal em Lausanne.

**Stack**: Next.js 14 (App Router) · TypeScript · Tailwind · Prisma · SQLite (dev) / Postgres (prod) · Stripe Checkout (cartão + TWINT) · NextAuth · next-intl (FR/EN/DE/PT) · Nodemailer (Infomaniak SMTP).

---

## 🚀 Quick start (5 minutos)

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edita .env.local — para já basta deixar os defaults para desenvolvimento

# 3. Criar base de dados local (SQLite) e popular com 50 produtos
npm run db:push
npm run db:seed

# 4. Arrancar
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) — redireciona para `/fr`.

**Login admin**: `/fr/admin/login`
- E-mail: `admin@kadoa.ch` (definido em `ADMIN_EMAIL`)
- Senha: `change-me-strong-password` (definido em `ADMIN_PASSWORD`)

> ⚠️ **Mudar a senha antes de produção.** Edita `ADMIN_PASSWORD` em `.env.local` e corre `npm run db:reset` para reaplicar o hash.

---

## 📁 O que tens neste site

### Frontend público
- `/[locale]` — Home com hero, serviços, categorias, produtos em destaque
- `/[locale]/products` — Catálogo (50 produtos, 5 categorias)
- `/[locale]/category/[slug]` — Filtro por categoria
- `/[locale]/products/[slug]` — Página de produto com personalização e add-to-cart
- `/[locale]/cart` — Carrinho persistente (localStorage)
- `/[locale]/checkout` — Checkout com Stripe (cartão), TWINT, PayPal, transferência bancária
- `/[locale]/checkout/success` — Página de sucesso pós-pagamento
- `/[locale]/about` — Sobre nós
- `/[locale]/contact` — Formulário de contacto + info
- `/[locale]/quote` — Formulário de orçamento detalhado
- `/[locale]/faq` — FAQ acordeão

### Painel admin (`/[locale]/admin`)
- Dashboard com KPIs (encomendas, receita, pendentes, novos orçamentos)
- CRUD de produtos com editor multilingue (FR/EN/DE/PT)
- Gestão de encomendas com mudança de estado
- Gestão de pedidos de orçamento (marcar respondido)
- Página de definições com check de integrações

### API (`/api/*`)
- `POST /api/checkout` — Cria encomenda + sessão Stripe (ou e-mail manual para transferência)
- `POST /api/stripe-webhook` — Confirma pagamento e atualiza encomenda
- `POST /api/quote` — Submete pedido de orçamento, e-mail para `info@kadoa.ch`
- `POST /api/contact` — Submete mensagem de contacto
- `GET/POST /api/auth/*` — NextAuth (sessões admin)
- `POST/DELETE /api/admin/products` — CRUD admin
- `PATCH /api/orders/[id]` — Mudança de estado
- `PATCH /api/admin/quotes` — Mudança de estado de orçamento

### Multi-idioma
- **FR** (padrão · Lausanne)
- **EN**
- **DE**
- **PT**

UI 100% traduzida. As descrições dos produtos têm FR + EN no seed; DE e PT podes preencher via admin (o formulário tem tabs por idioma).

### Imagens
Por agora, cada produto sem `imageUrl` é renderizado com um SVG placeholder em rosa baby com o nome do produto + ícone da categoria. Quando tiveres fotos reais, adiciona-as via:
1. **Admin** (recomendado): coloca o URL da imagem no campo "URL image" do formulário do produto.
2. **Hosting de imagens**: usa Cloudinary / Imgix / S3 / pasta `public/products/`. Já está autorizado em `next.config.mjs` para Cloudinary e Unsplash.

---

## 💳 Configuração Stripe + TWINT (obrigatório para pagamentos)

TWINT é nativamente suportado pelo Stripe nas contas suíças. Não há SDK separado.

### 1. Criar conta Stripe
1. [dashboard.stripe.com](https://dashboard.stripe.com) → Sign up
2. **Conta tem de ser registada na Suíça** (CHF + TWINT)
3. Settings → Payment methods → Activar **Card** e **TWINT**

### 2. Obter as chaves
1. Developers → API keys
2. Copiar **Publishable key** e **Secret key** (Test mode primeiro)

### 3. Configurar webhook
1. Developers → Webhooks → Add endpoint
2. URL: `https://www.kadoa.ch/api/stripe-webhook` (ou o teu dev URL via [Stripe CLI](https://stripe.com/docs/stripe-cli))
3. Events: `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_failed`
4. Copiar o **Signing secret**

### 4. Pôr no `.env.local`
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5. Testar localmente
```bash
# Numa shell, instalar Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/stripe-webhook
# Stripe CLI imprime o signing secret — usa-o em STRIPE_WEBHOOK_SECRET
```

Cartão de teste Stripe: `4242 4242 4242 4242` · qualquer CVC · qualquer data futura.

Para TWINT teste: o Stripe oferece um simulador no Checkout em test mode (segue o link "Use test details").

---

## 📧 E-mail (Infomaniak SMTP)

```env
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@kadoa.ch
SMTP_PASSWORD=palavra-passe-da-tua-mailbox
SMTP_FROM=Kadoa Sourires & Souvenirs <info@kadoa.ch>
```

**Onde encontrar a palavra-passe**: no painel Infomaniak → Mail Service → escolhe a mailbox `info@kadoa.ch`. Se preferires não usar a senha principal, cria uma "App password" (Infomaniak → Mail → Senhas de app).

Sem SMTP configurado o site continua a funcionar — os e-mails são apenas registados na consola do servidor.

---

## 🚢 Deploy em produção (Vercel)

### Passo 1: Postgres
Para produção, troca SQLite por Postgres. Recomendado: [Neon](https://neon.tech) ou [Supabase](https://supabase.com) (ambos têm tier gratuito).

1. Cria a base de dados, copia a connection string.
2. Edita `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"   // <-- antes era sqlite
     url      = env("DATABASE_URL")
   }
   ```
3. `DATABASE_URL=postgresql://...?sslmode=require` em `.env.production`.

### Passo 2: Vercel
1. Push para GitHub.
2. Em [vercel.com](https://vercel.com) → Import Project → seleciona o repo.
3. Configurar variáveis de ambiente (copia tudo de `.env.local`, mas com chaves Stripe **live**).
4. Após deploy: corre `npx prisma db push` e `npx prisma db seed` localmente apontando para a Postgres de produção, OU configura um job de "post-deploy" no Vercel.

### Passo 3: Domínio
1. Em Vercel → Domains → adicionar `kadoa.ch` e `www.kadoa.ch`.
2. Atualizar DNS no Infomaniak: criar `CNAME www → cname.vercel-dns.com` (Vercel mostra-te os exatos valores).

### Passo 4: Webhook Stripe
Atualizar URL do webhook em [dashboard.stripe.com](https://dashboard.stripe.com) para `https://www.kadoa.ch/api/stripe-webhook`.

---

## 📂 Estrutura do projeto

```
kadoa-ecommerce/
├── messages/                  # Traduções UI (fr, en, de, pt)
├── prisma/
│   ├── schema.prisma          # Modelo de dados
│   └── seed.ts                # 50 produtos + admin + settings
├── src/
│   ├── app/
│   │   ├── [locale]/          # Páginas públicas + admin (i18n)
│   │   ├── api/               # Routes API (checkout, webhook, quote, etc.)
│   │   ├── globals.css        # Tailwind + estilos base
│   │   └── layout.tsx         # Root passthrough
│   ├── components/            # UI partilhada (Header, ProductCard, …)
│   ├── i18n/                  # Configuração next-intl
│   ├── lib/                   # prisma, stripe, email, auth, format, …
│   ├── stores/                # Zustand (carrinho)
│   └── middleware.ts          # i18n routing
├── .env.example               # Template das variáveis de ambiente
├── tailwind.config.ts         # Cores rosa baby, fontes, animações
└── package.json
```

---

## 🧪 Comandos úteis

| Comando | O que faz |
|---|---|
| `npm run dev` | Arranca servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Corre o build de produção |
| `npm run db:push` | Aplica schema Prisma à BD |
| `npm run db:seed` | Popula 50 produtos + admin |
| `npm run db:reset` | Apaga BD + repopula (cuidado em produção!) |
| `npm run db:studio` | Abre [Prisma Studio](https://prisma.io/studio) (GUI da BD) |
| `npm run lint` | ESLint |

---

## 🔒 Notas de segurança

- ✅ Senha admin com hash bcrypt em BD (não em texto)
- ✅ Sessões JWT (NextAuth) com TTL de 8h
- ✅ Validação Zod em todas as APIs
- ✅ Webhook Stripe verificado por assinatura
- ✅ Preços recalculados no servidor a partir do BD (cliente não pode injetar)
- ✅ CORS gerido pelo Next.js
- 🔧 **Por fazer antes de produção**:
  - Configurar `NEXTAUTH_SECRET` para um valor forte (`openssl rand -base64 32`)
  - Mudar `ADMIN_PASSWORD`
  - Ativar HTTPS (Vercel fá-lo automaticamente)
  - Configurar Cloudflare ou similar para rate limiting

---

## 🎨 Personalizar o design

Cores principais em [tailwind.config.ts](tailwind.config.ts):
```ts
colors: {
  baby: {
    300: '#FFB6D9',   // rosa principal
    400: '#F894C3',
    ...
  }
}
```

Textos da UI em `messages/{fr,en,de,pt}.json`.

Informações da empresa em `src/lib/config.ts`.

---

## ❓ FAQ desenvolvimento

**Como adicionar um produto novo?**
Login admin → Produtos → Novo. Ou edita `prisma/seed.ts` e corre `npm run db:reset`.

**Como adicionar um idioma novo?**
1. Adicionar em `src/i18n/routing.ts` no array `locales`.
2. Criar `messages/<locale>.json` (copiar de `fr.json` e traduzir).
3. Adicionar a label no `LanguageSwitcher`.

**O TWINT só aparece no checkout se Stripe estiver em modo live?**
Sim, em test mode o TWINT é simulado mas funciona. Em live tens de ter conta Stripe suíça verificada.

**Posso desativar a SQLite?**
Sim — segue [Passo 1](#passo-1-postgres) acima e usa Postgres desde o início.

---

## 📞 Contactos

**Empresa**: Kadoa Sourires & Souvenirs · Lausanne 🇨🇭
**E-mail**: info@kadoa.ch
**WhatsApp**: +41 76 762 79 46
