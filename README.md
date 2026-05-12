# Gestão de Reuniões

Sistema web para gestão e análise de relatórios de presença exportados do Microsoft Teams e Microsoft Forms.

## Funcionalidades

- Importação de relatórios de presença do Teams (.csv, .xls)
- Importação de votações do Forms (.xlsx)
- Dashboard com filtros por nome, e-mail e engajamento
- Cards de resumo (participantes, câmera, mão, mudo)
- Resultado de votações com contagem por tipo de voto
- Exportação CSV compatível com Excel (PT-BR)
- Autenticação JWT

## Stack

- **Backend:** Java 21 + Spring Boot 3.3
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **Banco:** PostgreSQL 16
- **Infra:** Docker Compose + Nginx

## Como rodar

### 1. Clonar o repositório
```bash
git clone <url-do-repo>
cd gestao-reunioes
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com suas credenciais
nano .env
```

### 3. Subir os containers
```bash
docker compose up -d
```

A aplicação estará disponível em `http://localhost:3001`

## Estrutura
## Formatos de arquivo suportados

| Formato | Origem | Dados extraídos |
|---------|--------|----------------|
| `.csv` / `.xls` | Microsoft Teams | Nome, e-mail, entrada, saída, duração, câmera, mão, mudo |
| `.xlsx` | Microsoft Forms | Nome, e-mail, horário, voto |
