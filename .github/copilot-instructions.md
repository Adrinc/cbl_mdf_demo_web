# Demo Gestión MDF/IDF - Instrucciones para Agentes de IA

## Contexto del Proyecto

Esta es una **demo interactiva** de gestión de infraestructura MDF/IDF (Main Distribution Frame / Intermediate Distribution Frame) integrada en el portal **https://cbluna.com/**. Los usuarios acceden desde el portal principal y deben poder regresar en cualquier momento.

## Arquitectura General

Proyecto **Astro + React** con patrón de **componente principal orquestador** y secciones especializadas.

### Flujo de Datos Principal

```
index.astro → LayoutDemo.astro → DemoInteractivo.jsx (orquestador central)
                                          ↓
                        ┌─────────────────┴─────────────────┐
                        ↓                                    ↓
                LoginScreen.jsx                    [Secciones]
                        ↓                                    ↓
                CompanySelector → Dashboard/Inventory/Topology/Alerts/Settings
```

- **DemoInteractivo.jsx** es el componente raíz que maneja:
  - Estado de autenticación (`isLoggedIn`)
  - Navegación entre secciones (`activeSection`)
  - Datos compartidos (inventory, alerts, topologyConnections)
  - Sistema de tabs dinámico con renderizado condicional

### Gestión de Estado

- **Nanostores** para estado global reactivo:
  - `isEnglish` (atom) - Idioma de la interfaz (src/data/variables.js)
  - `selectedCountry` (atom con persistencia en localStorage)
- Estado local con `useState` para datos de sesión (inventory, alerts, configuración)

### Navegación y Salida

- **FAB de salida**: Botón flotante (FAB) en esquina inferior derecha presente en todas las pantallas
- **Navegación móvil**: Menú hamburguesa con panel lateral deslizante para pantallas < 768px
- **Estructura del menú móvil**:
  - Navegación entre secciones (Empresas, Dashboard, Inventario, etc.)
  - Información de sucursal seleccionada
  - Botón de salida de demo
- **Implementación de salida**: `window.location.href = 'https://cbluna.com/'`
- No usar referencias a marca "NetHive" - usar textos genéricos de "gestión MDF/IDF"

## Convenciones de Código

### Estructura de Componentes React

**SIEMPRE usar este patrón** para componentes con estilos modulares:

```jsx
import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { isEnglish } from '../../data/variables';
import styles from './css/componentName.module.css';

const ComponentName = ({ prop1, prop2 }) => {
  const ingles = useStore(isEnglish);
  
  // Estado local
  const [localState, setLocalState] = useState(defaultValue);
  
  return (
    <div className={styles.container}>
      {ingles ? 'English Text' : 'Texto en Español'}
    </div>
  );
};

export default ComponentName;
```

### Organización de CSS

- **CSS Modules obligatorio**: Cada componente tiene su propio `.module.css` en carpeta `css/` relativa
- Patrón de nombres: `componentName.module.css`
- Importación: `import styles from './css/componentName.module.css'`
- Reutilización: `tableSection.module.css` se comparte entre Inventory/Alerts/Settings

### Internacionalización (i18n)

**Patrón consistente en todos los componentes**:

```jsx
const content = {
  es: {
    title: "Título en Español",
    button: "Botón"
  },
  en: {
    title: "English Title",
    button: "Button"
  }
};

// Uso en JSX:
{ingles ? content.en.title : content.es.title}
```

NO usar bibliotecas i18n externas - el proyecto usa objetos literales con alternancia booleana.

### Estructura de Directorios

```
src/components/nethive/
├── [ComponentesRaiz].jsx
├── css/*.module.css
└── sections/
    ├── [SeccionGeneral].jsx
    └── [carpeta-especializada]/
        ├── [ComponentesEspecializados].jsx
        └── css/*.module.css
```

**Ejemplo**: `company-management/` contiene 6 componentes con sus estilos dedicados.

## Flujo de Trabajo del Desarrollador

### Comandos de Desarrollo

```bash
# Desarrollo (puerto 4321 por defecto)
npm run dev

# Build de producción (requiere memoria adicional)
npm run build

# Preview del build
npm run preview
```

**IMPORTANTE**: El script de build usa `--max-old-space-size=8192` para evitar errores de memoria en proyectos grandes.

### Configuración de Deployment

- **Site**: https://Adrinc.github.io
- **Base path**: `/cbl_mdf_demo_web`
- **Output**: Estático (SSG)
- Configurar en `astro.config.mjs`

### Manejo de Assets

Rutas públicas **deben incluir** `import.meta.env.BASE_URL`:

```astro
<link rel="icon" href={`${import.meta.env.BASE_URL}/favicon.png`} />
```

```jsx
e.target.src = `${import.meta.env.BASE_URL}/logo_nh_b.png`;
```

## Patrones Específicos del Proyecto

### Integración de Bibliotecas Externas (Leaflet, ReactFlow)

Siempre verificar disponibilidad del navegador:

```jsx
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  // Configuración de bibliotecas que requieren DOM
  delete L.Icon.Default.prototype._getIconUrl;
}
```

Usar `client:only="react"` en Astro para componentes hidratados:

```astro
<DemoInteractivo transition:persist client:only="react"/>
```

### Sistema de Navegación por Tabs

Las secciones se activan mediante `activeSection` state:

```jsx
const tabs = [
  { id: 'company-selector', label: 'Empresas', icon: '🏢' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊' }
];

// Renderizado condicional
{activeSection === 'company-selector' && (
  <CompanySelector {...props} />
)}
```

### Tablas Interactivas

El proyecto usa **@tanstack/react-table v8** para tablas con:
- Filtrado global y por columna
- Sorting
- Paginación

Ver `InventorySection.jsx` como referencia completa.

### Datos Mock

Los datos de inventario, alertas y topología están hardcoded en `DemoInteractivo.jsx` (líneas 28-68). Este es el lugar correcto para agregar/modificar datos de prueba.

## Dependencias Clave

- **Astro 4.16+**: Framework principal (SSG/SSR híbrido)
- **React 18**: UI library (modo islands)
- **Tailwind CSS + tailwindcss-animated**: Estilos utility-first + animaciones
- **Nanostores**: State management minimalista
- **Leaflet/React-Leaflet**: Mapas interactivos (CompanySelector)
- **ReactFlow**: Diagramas de topología de red
- **Recharts**: Gráficos y visualizaciones (Dashboard)
- **@tanstack/react-table**: Tablas avanzadas
- **FontAwesome**: Iconografía

## Consideraciones Importantes

1. **NO reemplazar CSS Modules por Tailwind directo** - el proyecto usa ambos estratégicamente
2. **Mantener el patrón de objetos `content` para i18n** - no agregar librerías i18n
3. **Las secciones reciben callbacks desde DemoInteractivo** - no implementar navegación local
4. **Los componentes Modal deben propagarse el estado `onClose`** hacia el padre
5. **Leaflet requiere CSS externo**: `import 'leaflet/dist/leaflet.css'`

## Referencias de Componentes Clave

- **Orquestador**: `DemoInteractivo.jsx`
- **Tablas avanzadas**: `InventorySection.jsx`
- **Mapas interactivos**: `CompanySelector.jsx`
- **Diagramas de red**: `TopologySection.jsx`
- **Dashboard con gráficos**: `DashboardStats.jsx`
