# Backend Requirements - Revalife Treatment Form API

## 📋 Visão Geral do Projeto

Este documento especifica todos os requisitos para o desenvolvimento do backend da aplicação **Revalife Treatment Form**, um questionário médico de 21 etapas para tratamento de emagrecimento com medicações GLP-1.

### Stack Tecnológica Obrigatória
- **Runtime**: Node.js (versão LTS mais recente)
- **Framework**: NestJS 10+
- **ORM**: Prisma 5+
- **Database**: PostgreSQL 15+
- **Validação**: class-validator + class-transformer
- **Documentação**: Swagger/OpenAPI 3.0
- **Timezone**: America/Sao_Paulo (UTC-3)

---

## 🎯 Objetivos do Sistema

1. **Criar e gerenciar sessões de formulário** com identificador único (UUID)
2. **Auto-save de respostas** com persistência incremental a cada alteração
3. **Validação robusta** de dados seguindo regras médicas específicas
4. **Webhook notification** para sistema externo a cada salvamento
5. **API RESTful** completa e bem documentada com OpenAPI/Swagger
6. **Tratamento de erros** consistente e informativo

---

## 🔄 Fluxo de Funcionamento

### 1. Início da Sessão (Frontend)
```
Usuario acessa → Home (/) → Clica "Iniciar" → GET /sessions/start → Redirect para /treatment-approach?sessionId={uuid}
```

### 2. Durante o Preenchimento
```
Usuario responde → Auto-save (2s debounce) → PATCH /sessions/{sessionId} → Webhook notification
```

### 3. Finalização
```
Última pergunta respondida → POST /sessions/{sessionId}/submit → Webhook com status "completed" → Tela de sucesso
```

---

## 📊 Modelo de Dados (Prisma Schema)

### Session (Tabela Principal)

```prisma
model Session {
  id            String   @id @default(uuid())
  
  // Timestamps
  createdAt     DateTime @default(now()) @db.Timestamptz(3)
  updatedAt     DateTime @updatedAt @db.Timestamptz(3)
  submittedAt   DateTime? @db.Timestamptz(3)
  
  // Dados do formulário (JSON)
  answers       Json     @default("{}")
  currentStep   Int      @default(0)
  
  // Status da sessão
  status        SessionStatus @default(IN_PROGRESS)
  
  // Dados de contato (extraídos do answers)
  fullName      String?
  email         String?
  phone         String?
  
  // Metadados
  ipAddress     String?
  userAgent     String?
  
  // Histórico de webhooks
  webhookLogs   WebhookLog[]
  
  @@index([email])
  @@index([createdAt])
  @@index([status])
  @@map("sessions")
}

enum SessionStatus {
  IN_PROGRESS
  COMPLETED
  ABANDONED
  ERROR
}
```

### WebhookLog (Histórico de Notificações)

```prisma
model WebhookLog {
  id          String   @id @default(uuid())
  sessionId   String
  session     Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  // Dados do webhook
  url         String
  method      String   @default("POST")
  payload     Json
  response    Json?
  statusCode  Int?
  
  // Controle
  attempts    Int      @default(1)
  success     Boolean  @default(false)
  error       String?
  
  createdAt   DateTime @default(now()) @db.Timestamptz(3)
  
  @@index([sessionId])
  @@index([createdAt])
  @@map("webhook_logs")
}
```

---

## 📝 Estrutura de Respostas (answers JSON)

O campo `answers` no banco armazena um objeto JSON com todas as respostas do formulário. Estrutura:

```typescript
{
  "weight-goal": "<5kg" | "5-10kg" | "10-20kg" | ">20kg" | "not-sure",
  "motivation": ["health", "self-esteem", "energy", ...], // array
  "previous-methods": ["restrictive-diet", "prescribed-medication", ...], // array
  "biological-sex": "male" | "female",
  "body-type-male": "thin" | "medium" | "large" | "overweight", // condicional (se male)
  "body-type-female": "thin" | "medium" | "large" | "overweight", // condicional (se female)
  "full-name": "string",
  "email": "email@example.com",
  "phone": "(00) 00000-0000",
  "consent": "accepted",
  "birthdate": "1990-01-15", // ISO date
  "current-weight": 75.5, // number
  "height": 170, // integer
  "health-conditions": ["diabetes", "hypothyroidism", ...], // array
  "uses-medication": "yes" | "no",
  "medication-types": ["antidepressants", "antidiabetics", ...], // array, condicional
  "medication-list": "Losartana 50mg - 1x ao dia", // textarea, condicional
  "family-health-conditions": ["thyroid-cancer", "pancreatitis", ...], // array
  "had-surgeries": "yes-less-12" | "yes-more-12" | "no",
  "glp1-medication": "tirzepatide" | "semaglutide" | "none",
  
  // Perguntas condicionais de Tirzepatida (se glp1-medication === "tirzepatide")
  "tirzepatide-side-effects": "strong" | "mild" | "none",
  "tirzepatide-current-use": "yes" | "no",
  "tirzepatide-application-method": "self-application" | "professional" | "other-person",
  "tirzepatide-last-use": "today" | "last-7-days" | "7-14-days" | "more-14-days",
  "tirzepatide-medical-supervision": "continuous" | "partial" | "none",
  "tirzepatide-dosage": "2.5mg" | "5mg" | "7.5mg" | "10mg" | "12.5mg" | "15mg" | "not-sure",
  
  // Pergunta condicional de Semaglutida (se glp1-medication === "semaglutide")
  "semaglutide-experience": "string (textarea)" // descrição da experiência
}
```

### ⚠️ Observações Importantes sobre Respostas

1. **Perguntas condicionais**: Nem todas as perguntas aparecem para todos os usuários
   - `body-type-male` OU `body-type-female` (baseado em `biological-sex`)
   - `medication-types` e `medication-list` (apenas se `uses-medication === "yes"`)
   - Perguntas de tirzepatida (apenas se `glp1-medication === "tirzepatide"`)
   - Pergunta de semaglutida (apenas se `glp1-medication === "semaglutide"`)

2. **Tipos de dados**:
   - `radio`: string (valor único)
   - `checkbox`: array de strings
   - `text/email/tel/textarea`: string
   - `date`: string ISO (YYYY-MM-DD)
   - `number`: number (float)
   - `integer`: number (int)
   - `consent`: string (sempre "accepted")

3. **Campos obrigatórios**: Todas as perguntas visíveis são obrigatórias (exceto `family-health-conditions`)

---

## 🛠️ Endpoints da API

### 1. Iniciar Nova Sessão

**Endpoint**: `GET /sessions/start`

**Descrição**: Cria uma nova sessão e retorna o sessionId para iniciar o formulário.

**Response 201**:
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2025-12-15T14:30:00.000Z",
  "status": "IN_PROGRESS"
}
```

**Implementação**:
- Gerar UUID v4 para sessionId
- Criar registro no banco com `status: IN_PROGRESS`
- Capturar IP e User-Agent da requisição (opcional)
- Retornar sessionId

---

### 2. Obter Sessão Existente

**Endpoint**: `GET /sessions/:sessionId`

**Descrição**: Retorna dados completos de uma sessão existente.

**Response 200**:
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "IN_PROGRESS",
  "currentStep": 5,
  "answers": {
    "weight-goal": "10-20kg",
    "motivation": ["health", "energy"],
    "biological-sex": "female"
  },
  "createdAt": "2025-12-15T14:30:00.000Z",
  "updatedAt": "2025-12-15T14:35:00.000Z",
  "submittedAt": null
}
```

**Response 404**:
```json
{
  "statusCode": 404,
  "message": "Sessão não encontrada",
  "error": "Not Found"
}
```

---

### 3. Atualizar Sessão (Auto-save)

**Endpoint**: `PATCH /sessions/:sessionId`

**Descrição**: Atualiza as respostas e step atual. Dispara webhook após sucesso.

**Request Body**:
```json
{
  "currentStep": 5,
  "answers": {
    "weight-goal": "10-20kg",
    "motivation": ["health", "energy"],
    "previous-methods": ["restrictive-diet"],
    "biological-sex": "female",
    "body-type-female": "medium",
    "full-name": "Maria Silva"
  }
}
```

**Validações**:
- `currentStep`: número inteiro entre 0 e 20
- `answers`: objeto com validações específicas por campo (ver seção Validações)
- SessionId deve existir
- Sessão não pode estar com status `COMPLETED` ou `ABANDONED`

**Response 200**:
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "IN_PROGRESS",
  "currentStep": 5,
  "updatedAt": "2025-12-15T14:35:00.000Z"
}
```

**Response 400** (validação falhou):
```json
{
  "statusCode": 400,
  "message": [
    "email must be a valid email address",
    "current-weight must be between 30 and 300"
  ],
  "error": "Bad Request"
}
```

**Response 409** (sessão já finalizada):
```json
{
  "statusCode": 409,
  "message": "Esta sessão já foi finalizada e não pode ser modificada",
  "error": "Conflict"
}
```

**Comportamento**:
1. Validar dados recebidos
2. Fazer merge das respostas (não sobrescrever tudo, apenas atualizar campos enviados)
3. Extrair e atualizar campos `fullName`, `email`, `phone` se presentes
4. Atualizar `updatedAt`
5. **Disparar webhook de forma assíncrona** (não bloquear resposta)
6. Retornar resposta de sucesso

---

### 4. Submeter Formulário Completo

**Endpoint**: `POST /sessions/:sessionId/submit`

**Descrição**: Marca a sessão como finalizada. Dispara webhook com status "completed".

**Request Body**:
```json
{
  "answers": {
    // objeto completo com todas as respostas finais
  }
}
```

**Validações**:
- Todas as perguntas obrigatórias devem estar presentes
- Validações completas de todos os campos
- Sessão não pode já estar `COMPLETED`

**Response 200**:
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "COMPLETED",
  "submittedAt": "2025-12-15T14:45:00.000Z",
  "message": "Formulário submetido com sucesso"
}
```

**Response 400** (dados incompletos):
```json
{
  "statusCode": 400,
  "message": "Formulário incompleto. Campos obrigatórios faltando: email, phone, consent",
  "error": "Bad Request"
}
```

**Comportamento**:
1. Validar todas as respostas
2. Atualizar `status: COMPLETED`
3. Definir `submittedAt: new Date()`
4. **Disparar webhook com flag de conclusão**
5. Retornar resposta de sucesso

---

### 5. Listar Sessões (Admin)

**Endpoint**: `GET /sessions`

**Query Params**:
- `status` (opcional): `IN_PROGRESS | COMPLETED | ABANDONED | ERROR`
- `page` (opcional, default: 1): número da página
- `limit` (opcional, default: 20, max: 100): itens por página
- `email` (opcional): filtrar por email
- `startDate` (opcional): filtrar sessões criadas após esta data
- `endDate` (opcional): filtrar sessões criadas antes desta data

**Response 200**:
```json
{
  "data": [
    {
      "sessionId": "...",
      "status": "COMPLETED",
      "fullName": "Maria Silva",
      "email": "maria@example.com",
      "phone": "(11) 99999-9999",
      "createdAt": "2025-12-15T14:30:00.000Z",
      "submittedAt": "2025-12-15T14:45:00.000Z"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

### 6. Reenviar Webhook

**Endpoint**: `POST /sessions/:sessionId/webhook/retry`

**Descrição**: Reenviar webhook manualmente em caso de falha.

**Response 200**:
```json
{
  "success": true,
  "message": "Webhook reenviado com sucesso",
  "webhookLogId": "..."
}
```

---

## ✅ Validações Detalhadas (class-validator)

### DTO Principal: UpdateSessionDto

```typescript
import { IsInt, Min, Max, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSessionDto {
  @ApiProperty({ minimum: 0, maximum: 20, example: 5 })
  @IsInt()
  @Min(0)
  @Max(20)
  currentStep: number;

  @ApiProperty({ type: 'object', description: 'Respostas do formulário' })
  @IsObject()
  @ValidateNested()
  @Type(() => FormAnswersDto)
  answers: FormAnswersDto;
}
```

### DTO de Respostas: FormAnswersDto

```typescript
export class FormAnswersDto {
  // STEP 1
  @IsOptional()
  @IsIn(['<5kg', '5-10kg', '10-20kg', '>20kg', 'not-sure'])
  @ApiProperty({ enum: ['<5kg', '5-10kg', '10-20kg', '>20kg', 'not-sure'] })
  'weight-goal'?: string;

  // STEP 2
  @IsOptional()
  @IsArray()
  @IsIn(['health', 'self-esteem', 'energy', 'event', 'discomfort', 'other'], { each: true })
  @ApiProperty({ type: [String], enum: ['health', 'self-esteem', 'energy', 'event', 'discomfort', 'other'] })
  motivation?: string[];

  // STEP 3
  @IsOptional()
  @IsArray()
  @IsIn(['restrictive-diet', 'prescribed-medication', 'supplements-teas', 'nutritional-program', 'bariatric-surgery', 'none'], { each: true })
  @ApiProperty({ 
    type: [String], 
    enum: ['restrictive-diet', 'prescribed-medication', 'supplements-teas', 'nutritional-program', 'bariatric-surgery', 'none'] 
  })
  'previous-methods'?: string[];

  // STEP 4
  @IsOptional()
  @IsIn(['male', 'female'])
  @ApiProperty({ enum: ['male', 'female'] })
  'biological-sex'?: string;

  // STEP 5 (condicional)
  @IsOptional()
  @IsIn(['thin', 'medium', 'large', 'overweight'])
  @ApiProperty({ enum: ['thin', 'medium', 'large', 'overweight'] })
  'body-type-male'?: string;

  @IsOptional()
  @IsIn(['thin', 'medium', 'large', 'overweight'])
  @ApiProperty({ enum: ['thin', 'medium', 'large', 'overweight'] })
  'body-type-female'?: string;

  // STEP 6
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @ApiProperty({ example: 'Maria Silva Santos' })
  'full-name'?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'maria@example.com' })
  email?: string;

  @IsOptional()
  @Matches(/^\(\d{2}\) \d{5}-\d{4}$/)
  @ApiProperty({ example: '(11) 99999-9999' })
  phone?: string;

  @IsOptional()
  @IsIn(['accepted'])
  @ApiProperty({ enum: ['accepted'] })
  consent?: string;

  // STEP 7
  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '1990-01-15' })
  birthdate?: string;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(300)
  @ApiProperty({ minimum: 30, maximum: 300, example: 75.5 })
  'current-weight'?: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(250)
  @ApiProperty({ minimum: 100, maximum: 250, example: 170 })
  height?: number;

  // STEP 8
  @IsOptional()
  @IsArray()
  @IsIn(['diabetes', 'hypothyroidism', 'hypertension', 'heart-disease', 'pancreatitis', 'cancer', 'gastrointestinal', 'none'], { each: true })
  @ApiProperty({ 
    type: [String], 
    enum: ['diabetes', 'hypothyroidism', 'hypertension', 'heart-disease', 'pancreatitis', 'cancer', 'gastrointestinal', 'none'] 
  })
  'health-conditions'?: string[];

  // STEP 9
  @IsOptional()
  @IsIn(['yes', 'no'])
  @ApiProperty({ enum: ['yes', 'no'] })
  'uses-medication'?: string;

  // STEP 10 (condicional)
  @IsOptional()
  @IsArray()
  @IsIn(['antidepressants', 'antidiabetics', 'contraceptives', 'antihypertensives', 'thyroid-hormone', 'corticosteroids', 'none'], { each: true })
  @ApiProperty({ 
    type: [String], 
    enum: ['antidepressants', 'antidiabetics', 'contraceptives', 'antihypertensives', 'thyroid-hormone', 'corticosteroids', 'none'] 
  })
  'medication-types'?: string[];

  // STEP 11 (condicional)
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(1000)
  @ApiProperty({ example: 'Losartana 50mg - 1x ao dia\nMetformina 850mg - 2x ao dia' })
  'medication-list'?: string;

  // STEP 13
  @IsOptional()
  @IsArray()
  @IsIn(['thyroid-cancer', 'pancreatitis', 'men2', 'diabetes-type1', 'diabetes-type2', 'none'], { each: true })
  @ApiProperty({ 
    type: [String], 
    enum: ['thyroid-cancer', 'pancreatitis', 'men2', 'diabetes-type1', 'diabetes-type2', 'none'] 
  })
  'family-health-conditions'?: string[];

  // STEP 14
  @IsOptional()
  @IsIn(['yes-less-12', 'yes-more-12', 'no'])
  @ApiProperty({ enum: ['yes-less-12', 'yes-more-12', 'no'] })
  'had-surgeries'?: string;

  // STEP 15
  @IsOptional()
  @IsIn(['tirzepatide', 'semaglutide', 'none'])
  @ApiProperty({ enum: ['tirzepatide', 'semaglutide', 'none'] })
  'glp1-medication'?: string;

  // STEPS 16-21 (condicionais Tirzepatida)
  @IsOptional()
  @IsIn(['strong', 'mild', 'none'])
  @ApiProperty({ enum: ['strong', 'mild', 'none'] })
  'tirzepatide-side-effects'?: string;

  @IsOptional()
  @IsIn(['yes', 'no'])
  @ApiProperty({ enum: ['yes', 'no'] })
  'tirzepatide-current-use'?: string;

  @IsOptional()
  @IsIn(['self-application', 'professional', 'other-person'])
  @ApiProperty({ enum: ['self-application', 'professional', 'other-person'] })
  'tirzepatide-application-method'?: string;

  @IsOptional()
  @IsIn(['today', 'last-7-days', '7-14-days', 'more-14-days'])
  @ApiProperty({ enum: ['today', 'last-7-days', '7-14-days', 'more-14-days'] })
  'tirzepatide-last-use'?: string;

  @IsOptional()
  @IsIn(['continuous', 'partial', 'none'])
  @ApiProperty({ enum: ['continuous', 'partial', 'none'] })
  'tirzepatide-medical-supervision'?: string;

  @IsOptional()
  @IsIn(['2.5mg', '5mg', '7.5mg', '10mg', '12.5mg', '15mg', 'not-sure'])
  @ApiProperty({ enum: ['2.5mg', '5mg', '7.5mg', '10mg', '12.5mg', '15mg', 'not-sure'] })
  'tirzepatide-dosage'?: string;

  // STEP 18 (condicional Semaglutida)
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  @ApiProperty({ example: 'Usei por 3 meses, perdi 8kg, última dose foi 1mg...' })
  'semaglutide-experience'?: string;
}
```

### Validações Customizadas

Além das validações básicas, implementar validações de negócio:

1. **Validação de idade**: `birthdate` deve resultar em idade >= 18 anos
2. **Validação de IMC**: calcular e registrar (height e current-weight)
3. **Validações condicionais**:
   - Se `uses-medication === 'yes'`, então `medication-types` é obrigatório
   - Se `medication-types` contém `'none'`, então `medication-list` é obrigatório
   - Se `biological-sex === 'male'`, então `body-type-male` é obrigatório
   - Se `biological-sex === 'female'`, então `body-type-female` é obrigatório
   - Se `glp1-medication === 'tirzepatide'`, validar campos de tirzepatida
   - Se `glp1-medication === 'semaglutide'`, validar `semaglutide-experience`

---

## 🔔 Integração com Webhook

### Configuração

O webhook deve ser configurável via variável de ambiente:

```env
WEBHOOK_URL=https://webhook.site/unique-uuid
WEBHOOK_TIMEOUT=10000
WEBHOOK_RETRY_ATTEMPTS=3
WEBHOOK_RETRY_DELAY=5000
```

### Payload do Webhook

**Evento: session.updated** (disparado em PATCH):
```json
{
  "event": "session.updated",
  "timestamp": "2025-12-15T14:35:00.000Z",
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "IN_PROGRESS",
    "currentStep": 5,
    "totalSteps": 21,
    "completionPercentage": 23.8,
    "answers": {
      "weight-goal": "10-20kg",
      "motivation": ["health", "energy"],
      "biological-sex": "female",
      "body-type-female": "medium",
      "full-name": "Maria Silva"
    },
    "contact": {
      "fullName": "Maria Silva",
      "email": null,
      "phone": null
    },
    "createdAt": "2025-12-15T14:30:00.000Z",
    "updatedAt": "2025-12-15T14:35:00.000Z"
  }
}
```

**Evento: session.completed** (disparado em POST submit):
```json
{
  "event": "session.completed",
  "timestamp": "2025-12-15T14:45:00.000Z",
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "COMPLETED",
    "currentStep": 20,
    "totalSteps": 21,
    "completionPercentage": 100,
    "answers": {
      // objeto completo com todas as respostas
    },
    "contact": {
      "fullName": "Maria Silva Santos",
      "email": "maria@example.com",
      "phone": "(11) 99999-9999"
    },
    "calculatedData": {
      "age": 34,
      "bmi": 26.1
    },
    "createdAt": "2025-12-15T14:30:00.000Z",
    "updatedAt": "2025-12-15T14:45:00.000Z",
    "submittedAt": "2025-12-15T14:45:00.000Z"
  }
}
```

### Comportamento do Webhook

1. **Requisição HTTP**:
   - Método: `POST`
   - Headers: `Content-Type: application/json`
   - Timeout: 10 segundos (configurável)
   - Body: JSON conforme acima

2. **Retry Logic**:
   - Em caso de falha (status !== 2xx ou timeout), tentar novamente
   - Máximo de 3 tentativas (configurável)
   - Delay entre tentativas: 5 segundos (configurável)
   - Usar backoff exponencial (5s, 10s, 20s)

3. **Logging**:
   - Registrar TODAS as tentativas na tabela `WebhookLog`
   - Salvar payload, response, statusCode, tentativas, sucesso/erro

4. **Execução Assíncrona**:
   - Webhook NÃO deve bloquear a resposta da API
   - Usar fila (Bull/BullMQ) ou processar em background
   - Se não usar fila, executar promise sem await mas com tratamento de erro

---

## 📚 Documentação Swagger/OpenAPI

### Configuração Obrigatória

```typescript
// main.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Revalife Treatment Form API')
  .setDescription('API para gerenciamento de formulários de tratamento médico com medicações GLP-1')
  .setVersion('1.0')
  .addTag('sessions', 'Gerenciamento de sessões do formulário')
  .addServer('http://localhost:3000', 'Local Development')
  .addServer('https://api.revalife.com', 'Production')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document, {
  customSiteTitle: 'Revalife API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
});
```

### Decoradores nos Controllers

```typescript
@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  
  @Get('start')
  @ApiOperation({ summary: 'Iniciar nova sessão' })
  @ApiResponse({ 
    status: 201, 
    description: 'Sessão criada com sucesso',
    type: CreateSessionResponseDto 
  })
  async startSession() { ... }

  @Get(':sessionId')
  @ApiOperation({ summary: 'Obter dados de uma sessão' })
  @ApiParam({ name: 'sessionId', description: 'UUID da sessão' })
  @ApiResponse({ status: 200, type: SessionResponseDto })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada' })
  async getSession(@Param('sessionId') sessionId: string) { ... }

  @Patch(':sessionId')
  @ApiOperation({ summary: 'Atualizar sessão (auto-save)' })
  @ApiParam({ name: 'sessionId', description: 'UUID da sessão' })
  @ApiBody({ type: UpdateSessionDto })
  @ApiResponse({ status: 200, type: UpdateSessionResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada' })
  @ApiResponse({ status: 409, description: 'Sessão já finalizada' })
  async updateSession(
    @Param('sessionId') sessionId: string,
    @Body() updateDto: UpdateSessionDto
  ) { ... }

  @Post(':sessionId/submit')
  @ApiOperation({ summary: 'Submeter formulário completo' })
  @ApiParam({ name: 'sessionId', description: 'UUID da sessão' })
  @ApiBody({ type: SubmitSessionDto })
  @ApiResponse({ status: 200, type: SubmitSessionResponseDto })
  @ApiResponse({ status: 400, description: 'Formulário incompleto ou inválido' })
  async submitSession(
    @Param('sessionId') sessionId: string,
    @Body() submitDto: SubmitSessionDto
  ) { ... }
}
```

---

## 🏗️ Estrutura de Pastas Sugerida

```
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── decorators/
│   │   └── conditional-validation.decorator.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   └── logging.interceptor.ts
│   └── pipes/
│       └── validation.pipe.ts
├── config/
│   ├── database.config.ts
│   ├── webhook.config.ts
│   └── app.config.ts
├── prisma/
│   ├── prisma.service.ts
│   ├── prisma.module.ts
│   └── schema.prisma
├── sessions/
│   ├── sessions.module.ts
│   ├── sessions.controller.ts
│   ├── sessions.service.ts
│   ├── dto/
│   │   ├── create-session.dto.ts
│   │   ├── update-session.dto.ts
│   │   ├── submit-session.dto.ts
│   │   ├── form-answers.dto.ts
│   │   └── session-response.dto.ts
│   ├── entities/
│   │   └── session.entity.ts
│   └── validators/
│       ├── conditional-fields.validator.ts
│       ├── age.validator.ts
│       └── bmi.validator.ts
└── webhooks/
    ├── webhooks.module.ts
    ├── webhooks.service.ts
    ├── dto/
    │   └── webhook-payload.dto.ts
    └── processors/
        └── webhook.processor.ts (se usar fila)
```

---

## 🔐 Segurança e Performance

### CORS
```typescript
app.enableCors({
  origin: [
    'http://localhost:3001',
    'https://revalife.com',
    'https://www.revalife.com'
  ],
  credentials: true,
});
```

### Rate Limiting
```typescript
import { ThrottlerModule } from '@nestjs/throttler';

ThrottlerModule.forRoot([{
  ttl: 60000, // 1 minuto
  limit: 100, // 100 requisições
}])
```

### Validação Global
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true, // Remove propriedades não definidas no DTO
  forbidNonWhitelisted: true, // Lança erro se propriedade extra for enviada
  transform: true, // Transforma tipos automaticamente
}));
```

### Compressão
```typescript
import compression from '@nestjs/platform-express';
app.use(compression());
```

---

## 📊 Campos Calculados

Calcular e incluir no webhook (campo `calculatedData`):

1. **Idade**: `birthdate` → idade em anos
2. **IMC**: `current-weight / (height/100)²`
3. **Completion Percentage**: `(currentStep + 1) / totalSteps * 100`

---

## 🧪 Testes Sugeridos

1. **Unit Tests**:
   - Validações de DTOs
   - Lógica de negócio no Service
   - Cálculos (idade, IMC)

2. **Integration Tests**:
   - Endpoints completos
   - Validações condicionais
   - Fluxo de sessão completo

3. **E2E Tests**:
   - Criar sessão → atualizar → submeter
   - Webhook integration

---

## 📦 Variáveis de Ambiente (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/revalife_db?schema=public"

# App
NODE_ENV=development
PORT=3000

# Webhook
WEBHOOK_URL=https://webhook.site/unique-uuid
WEBHOOK_TIMEOUT=10000
WEBHOOK_RETRY_ATTEMPTS=3
WEBHOOK_RETRY_DELAY=5000

# Cors (separado por vírgulas)
ALLOWED_ORIGINS=http://localhost:3001,https://revalife.com

# Rate Limiting
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=100
```

---

## 🚀 Comandos de Início

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Rodar migrations
npx prisma migrate dev --name init

# Seed inicial (opcional)
npx prisma db seed

# Rodar em desenvolvimento
npm run start:dev

# Build para produção
npm run build
npm run start:prod
```

---

## 📝 Observações Finais

1. **Timezone**: Todos os timestamps devem usar `America/Sao_Paulo` (UTC-3)
2. **Logs estruturados**: Usar Winston ou Pino com formato JSON
3. **Health check**: Criar endpoint `GET /health` retornando status do DB
4. **Graceful shutdown**: Implementar handlers para SIGTERM e SIGINT
5. **Prisma Studio**: Disponível em `npx prisma studio` para visualizar dados
6. **Migrations**: Sempre versionar no Git (`prisma/migrations/`)
7. **Validação de email**: Apenas formato, não verificar se existe
8. **Validação de telefone**: Apenas formato brasileiro `(XX) XXXXX-XXXX`
9. **Campos opcionais**: Nem todas as perguntas são respondidas por todos
10. **Performance**: Indexar campos usados em queries (`email`, `createdAt`, `status`)

---

## ✨ Extras Opcionais (Bônus)

1. **Dashboard administrativo**: Endpoint para métricas
   - Total de sessões por status
   - Taxa de conclusão
   - Tempo médio de preenchimento
   - Perguntas mais abandonadas

2. **Export de dados**: Endpoint para exportar CSV/Excel

3. **Soft delete**: Em vez de deletar, marcar como `DELETED`

4. **Versionamento de respostas**: Histórico de mudanças

5. **Notificações por email**: Enviar email de confirmação ao completar

---

## 📞 Contato e Dúvidas

Este documento cobre todos os requisitos para o desenvolvimento do backend. Qualquer dúvida ou necessidade de complementação, estou disponível para esclarecer!

**Boa sorte com a implementação! 🚀**
