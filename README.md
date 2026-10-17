# IRON PULSE

Landing page responsiva de academia em HTML, CSS e JavaScript ES modules, sem etapa de build.

## Como rodar

Abra `index.html` em um navegador moderno. Para evitar restrições de módulos locais, também é possível iniciar um servidor estático na pasta do projeto:

```bash
node server.js
```

Então acesse `http://localhost:8000`. Three.js, GSAP e as fontes são carregados por CDN/Google Fonts e precisam de conexão à internet. Sem Three.js a página mantém a arte de fundo e as demais funções continuam disponíveis.

## Personalização

- **Nome e marca:** edite `IRON PULSE` no `index.html` e os textos de marca em `js/main.js`.
- **Cores:** altere os tokens em `css/variables.css`. O vermelho principal é `--red` e o fundo é `--bg`.
- **Textos e conteúdo:** edite os textos das seções em `index.html`; modalidades, depoimentos e grade de horários ficam em `js/main.js` e `data/schedule.js`.
- **Planos e equipe:** ajuste `data/plans.js` e `data/trainers.js`.
- **Exercícios:** altere a lista e os grupos em `data/exercises.js`. As fichas montadas ficam no armazenamento local do navegador.

## Funcionalidades

Cena 3D interativa (com halter como easter egg), animações de entrada, tilt, filtros e ficha de treino com drag-and-drop, presets, cronômetro com alerta sonoro, impressão, calculadoras, grade filtrável, slider antes/depois, carrossel, FAQ, matrícula validada em quatro etapas, cartão com QR demonstrativo, área de aluno e confirmações de formulário. Os dados de matrícula e treino são mantidos no `localStorage` do navegador.
