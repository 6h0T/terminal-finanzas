# Características del Terminal Financiero

## 🚀 Funcionalidades Principales

### Gráficos Históricos en Tiempo Real
- **Almacenamiento automático**: Cada 30 segundos se guardan snapshots de precios
- **Datos intradiarios**: Muestra la variación del día actual (desde las 00:00hs)
- **Persistencia en JSON**: Los datos se guardan en `data/market-history.json`
- **Muestreo inteligente**: Hasta 48 puntos por gráfico para rendimiento óptimo
- **Fallback elegante**: Si no hay datos históricos, muestra gráfico estático

### Mercados Soportados
- **Argentina**: CEDEARs, Acciones, Bonos, Letras, Obligaciones Negociables, Opciones
- **USA**: Tech, Financiero, Energía, Salud, Consumo, Industrial, Real Estate, ETFs

### SEO y Analytics
- ✅ **Vercel Analytics** integrado
- ✅ **robots.txt** configurado para indexación
- ✅ **Sitemap.xml** dinámico
- ✅ **Manifest.json** para PWA
- ✅ **Open Graph** y **Twitter Cards**
- ✅ Metadatos optimizados para SEO

## 📊 Cómo Funcionan los Gráficos Históricos

### Flujo de Datos

1. **Captura**: `/api/mercado` guarda snapshot cada vez que se consulta (cada 30s)
2. **Almacenamiento**: Se guarda en memoria y se persiste en JSON
3. **Consulta**: `/api/historico?symbols=AAPL,GOOGL,...` devuelve array de precios
4. **Renderizado**: El componente `Sparkline` muestra los datos históricos

### Estructura de Datos

```typescript
{
  "2026-04-01": {
    "AAPL": [
      {
        "symbol": "AAPL",
        "price": 1250.50,
        "pct_change": 2.5,
        "timestamp": 1711987200000,
        "date": "2026-04-01"
      },
      // ... más snapshots
    ]
  }
}
```

### Limitaciones

- **Solo día actual**: Los datos se resetean a medianoche
- **Máximo 2880 snapshots por símbolo**: ~1 cada 30s durante 24hs
- **Primeros 100 símbolos**: Por rendimiento, solo se consultan los primeros 100
- **⚠️ Vercel Production**: En producción, los datos históricos se mantienen **solo en memoria** (no persisten entre deployments) porque el filesystem de Vercel es read-only. Para persistencia real, se necesitaría una base de datos externa como Vercel KV, Postgres, o Redis.

## 🎨 Componentes Modificados

### `sparkline.tsx`
- Nuevo prop `historicalData?: number[]`
- Si hay datos históricos (≥8 puntos), los usa
- Sino, muestra datos estáticos de fallback

### `bloomberg-terminal.tsx`
- Fetch de históricos con SWR
- Cache de 60 segundos
- Pasa datos a cada Sparkline

### `lib/db.ts`
- Sistema de almacenamiento en memoria + JSON
- Funciones: `saveSnapshot`, `getSnapshotsForSymbols`, `sampleSnapshots`
- Auto-limpieza de días anteriores

## 🔧 APIs

### GET `/api/historico`
```
GET /api/historico?symbols=AAPL,GOOGL,MSFT

Response:
{
  "data": {
    "AAPL": [150.2, 151.3, 152.1, ...],
    "GOOGL": [2800.5, 2805.2, ...],
    "MSFT": [380.1, 381.5, ...]
  },
  "date": "2026-04-01",
  "timestamp": 1711987200000
}
```

### POST `/api/mercado`
- Automáticamente guarda snapshots en background
- No bloquea la respuesta al cliente
- Usa `setImmediate()` para ejecución asíncrona

## 📁 Archivos Nuevos

```
lib/
  └── db.ts                    # Sistema de almacenamiento
app/
  ├── api/
  │   └── historico/
  │       └── route.ts         # Endpoint de históricos
  ├── sitemap.ts               # Sitemap dinámico
  └── manifest.ts              # PWA manifest
public/
  └── robots.txt               # Configuración de crawlers
data/
  └── market-history.json      # Datos históricos (gitignored)
```

## 🚀 Próximos Pasos

- [ ] Agregar gráficos de velas (candlestick)
- [ ] Exportar datos históricos a CSV
- [ ] Alertas de precio
- [ ] Comparación entre símbolos
- [ ] Modo offline con Service Worker
