# 📈 BloomArg - Terminal de Cotizaciones en Tiempo Real

Panel de cotizaciones en tiempo real estilo Bloomberg Terminal para los mercados argentino y estadounidense. Visualizá acciones, CEDEARs, bonos, letras, obligaciones negociables y ETFs con actualización automática cada 30 segundos.

![BloomArg](https://img.shields.io/badge/BloomArg-Cotizaciones-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## ✨ Características

- 🌎 **Dual Market**: Mercado Argentino y USA en una sola aplicación
- 📊 **Categorías Organizadas**: 
  - **Argentina**: CEDEARs, Acciones, Bonos, Letras, ONs, Opciones
  - **USA**: Tech, Financiero, Energía, Salud, Consumo, Industrial, Real Estate, ETFs
- 💱 **Cotizaciones de Dólar**: Oficial, Blue, MEP, CCL, Cripto, Tarjeta
- 🔥 **Mapa de Calor**: Visualización de CEDEARs por variación porcentual
- 🔍 **Búsqueda en Tiempo Real**: Filtrá por símbolo o nombre
- 🌓 **Modo Oscuro/Claro**: Tema adaptable
- 📱 **Responsive**: Diseño optimizado para mobile, tablet y desktop
- ⚡ **Auto-refresh**: Actualización automática cada 30 segundos
- 🖥️ **Fullscreen**: Modo pantalla completa
- 📈 **Sparklines**: Gráficos históricos en miniatura

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/6h0T/terminal-finanzas.git
cd terminal-finanzas

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build para Producción

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
terminal-finanzas/
├── app/
│   ├── api/
│   │   ├── mercado/
│   │   │   └── route.ts          # API endpoint mercado argentino
│   │   ├── usa-stocks/
│   │   │   └── route.ts          # API endpoint mercado USA
│   │   └── historico/
│   │       └── route.ts          # API endpoint datos históricos
│   ├── layout.tsx                # Layout principal + metadata
│   ├── page.tsx                  # Página principal
│   └── globals.css               # Estilos globales
├── components/
│   └── cedear-heatmap.tsx        # Componente mapa de calor
├── lib/
│   ├── usa-stocks-categories.ts  # Categorización acciones USA
│   └── utils.ts                  # Utilidades
├── bloomberg-terminal.tsx        # Componente principal
├── sparkline.tsx                 # Componente gráficos miniatura
└── README.md
```

## 🔌 API Endpoints

### 1. Mercado Argentino
**Endpoint**: `/api/mercado`

**Parámetros**: 
- `category` (opcional): `all`, `cedears`, `acciones`, `bonos`, `letras`, `obligaciones`, `opciones`

**Fuentes de datos**:
- CEDEARs: `https://data912.com/live/arg_cedears`
- Acciones: `https://data912.com/live/arg_stocks`
- Bonos: `https://data912.com/live/arg_bonds`
- Letras: `https://data912.com/live/arg_notes`
- Obligaciones: `https://data912.com/live/arg_corp`
- Opciones: `https://data912.com/live/arg_options`
- Dólar: `https://dolarapi.com/v1/dolares`

**Respuesta**:
```json
{
  "data": {
    "cedears": [...],
    "acciones": [...],
    "bonos": [...],
    "letras": [...],
    "obligaciones": [...],
    "opciones": [...]
  },
  "dolar": {
    "oficial": { "casa": "oficial", "compra": 1050, "venta": 1090 },
    "blue": { "casa": "blue", "compra": 1300, "venta": 1320 },
    ...
  },
  "summary": {
    "totalCedears": 150,
    "totalAcciones": 200,
    ...
  },
  "lastUpdate": "2026-04-01T19:30:00.000Z"
}
```

### 2. Mercado USA
**Endpoint**: `/api/usa-stocks`

**Fuente de datos**: `https://data912.com/live/usa_stocks`

**Categorización**: Las ~6000 acciones se clasifican automáticamente en:
- Tech (AAPL, MSFT, GOOGL, META, NVDA, etc.)
- Financial (JPM, BAC, GS, V, MA, etc.)
- Energy (XOM, CVX, COP, SLB, etc.)
- Healthcare (JNJ, UNH, PFE, ABBV, etc.)
- Consumer (AMZN, TSLA, WMT, HD, etc.)
- Industrial (BA, GE, CAT, HON, etc.)
- Real Estate (AMT, PLD, SPG, etc.)
- ETFs (SPY, QQQ, DIA, IWM, etc.)

**Respuesta**:
```json
{
  "data": {
    "tech": [...],
    "financial": [...],
    "energy": [...],
    ...
  },
  "summary": {
    "totalTech": 80,
    "totalFinancial": 60,
    ...
  },
  "lastUpdate": "2026-04-01T19:30:00.000Z"
}
```

### 3. Datos Históricos
**Endpoint**: `/api/historico`

**Parámetros**:
- `symbols`: Lista de símbolos separados por coma (max 100)

**Respuesta**:
```json
{
  "data": {
    "AAPL": [150.2, 151.5, 149.8, 152.1, ...],
    "GGAL": [2500, 2520, 2480, 2550, ...],
    ...
  }
}
```

## 🛠️ Stack Tecnológico

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React Framework con App Router
- **[React 19](https://react.dev/)** - Biblioteca UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Lucide React](https://lucide.dev/)** - Iconos

### Data Fetching & State
- **[SWR](https://swr.vercel.app/)** - React Hooks para data fetching
- **React Hooks** - useState, useEffect, useCallback

### APIs & Data Sources
- **[data912.com](https://data912.com/)** - Cotizaciones mercado argentino y USA
- **[DolarAPI](https://dolarapi.com/)** - Cotizaciones del dólar
- **[google-sheets-argento](https://github.com/ferminrp/google-sheets-argento)** - Documentación de endpoints

### Deployment
- **[Vercel](https://vercel.com/)** - Hosting y CI/CD
- **[Vercel Analytics](https://vercel.com/analytics)** - Analytics

## 🎨 Funcionalidades Principales

### Selector de Mercado
Dropdown en la barra de navegación que permite cambiar entre:
- **Mercado Argentino**: CEDEARs, Acciones, Bonos, Letras, ONs, Opciones
- **Mercado de USA**: Tech, Financial, Energy, Healthcare, Consumer, Industrial, Real Estate, ETFs

### Actualización Manual
- Límite de **2 actualizaciones manuales por hora**
- Contador visible en tooltip del botón refresh
- Reseteo automático cada 60 minutos

### Modo Pantalla Completa
- Botón **Maximize**: Entra en fullscreen
- Botón **Minimize**: Sale de fullscreen (solo visible en fullscreen)
- Detección automática de cambios (F11, Esc)

### Búsqueda
- Filtrado en tiempo real por símbolo o nombre
- Funciona en todas las categorías y mercados

### Mapa de Calor
- Visualización de CEDEARs por variación porcentual
- Colores: Verde (positivo) → Rojo (negativo)
- Solo disponible para mercado argentino

## 📊 Cómo Funciona

1. **Carga Inicial**: Al abrir la app, se carga el mercado argentino con la categoría CEDEARs por defecto
2. **Auto-refresh**: Cada 30 segundos, SWR actualiza automáticamente los datos
3. **Cambio de Mercado**: Al seleccionar USA, se desactiva el fetch de Argentina y se activa USA (y viceversa)
4. **Categorización USA**: Las acciones USA se clasifican usando listas curadas de símbolos por sector
5. **Sparklines**: Se cargan datos históricos de los primeros 100 símbolos visibles
6. **Fullscreen**: Usa la Fullscreen API del navegador para modo inmersivo

## 📝 Créditos

### Fuentes de Datos
Este proyecto utiliza datos provistos por:
- **[google-sheets-argento](https://github.com/ferminrp/google-sheets-argento)** - Repositorio con documentación de endpoints de data912.com
- **[data912.com](https://data912.com/)** - API de cotizaciones en tiempo real
- **[DolarAPI](https://dolarapi.com/)** - API de cotizaciones del dólar

### Desarrollo
Diseñado y desarrollado por **[gh0t](https://github.com/6h0T)**
- Portfolio: [gh0t.art](https://gh0t.art)
- GitHub: [@6h0T](https://github.com/6h0T)

## 🙏 Agradecimientos

Un agradecimiento especial a:
- **Fermín Rodríguez Picón** ([@ferminrp](https://github.com/ferminrp)) por el repositorio [google-sheets-argento](https://github.com/ferminrp/google-sheets-argento)
- **data912.com** por proveer las APIs de cotizaciones
- **DolarAPI** por las cotizaciones del dólar
- La comunidad de Next.js y React

## ⭐ Apoyá el Proyecto

Si este proyecto te resultó útil, **dale una estrella ⭐** en GitHub. Ayuda a que más personas lo descubran y motiva a seguir mejorándolo.

[![GitHub stars](https://img.shields.io/github/stars/6h0T/terminal-finanzas?style=social)](https://github.com/6h0T/terminal-finanzas)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si querés agregar features, reportar bugs o mejorar la documentación:

1. Fork el proyecto
2. Creá tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abrí un Pull Request

---

**Hecho con ❤️ en Argentina** | [gh0t.art](https://gh0t.art)
