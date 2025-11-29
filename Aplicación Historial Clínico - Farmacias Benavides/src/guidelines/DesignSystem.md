# Design System - Farmacias Benavides

## Tipografía

### Fuente Base
La aplicación utiliza **Inter** como fuente principal para todo el contenido. Inter es una fuente sans-serif moderna, diseñada específicamente para interfaces digitales, con excelente legibilidad en pantallas.

```css
--font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Familias de Fuentes

- **Base/Cuerpo**: `var(--font-family-base)` - Inter para todo el texto general
- **Encabezados**: `var(--font-family-heading)` - Inter para títulos y encabezados
- **Monoespacio**: `var(--font-family-mono)` - Para código y datos técnicos (CURP, IDs, etc.)

### Escala de Tamaños

```css
--text-xs: 0.75rem;     /* 12px - Texto muy pequeño, anotaciones */
--text-sm: 0.875rem;    /* 14px - Labels, texto secundario */
--text-base: 1rem;      /* 16px - Texto principal */
--text-lg: 1.125rem;    /* 18px - Texto destacado */
--text-xl: 1.25rem;     /* 20px - Subtítulos */
--text-2xl: 1.5rem;     /* 24px - Títulos de sección */
--text-3xl: 1.875rem;   /* 30px - Títulos principales */
--text-4xl: 2.25rem;    /* 36px - Títulos display */
```

### Pesos de Fuente

```css
--font-weight-light: 300;       /* Texto muy ligero */
--font-weight-normal: 400;      /* Texto normal, cuerpo */
--font-weight-medium: 500;      /* Énfasis medio */
--font-weight-semibold: 600;    /* Énfasis fuerte */
--font-weight-bold: 700;        /* Máximo énfasis */
```

### Altura de Línea (Line Height)

```css
--line-height-none: 1;          /* Sin espacio extra */
--line-height-tight: 1.25;      /* Para títulos */
--line-height-normal: 1.5;      /* Estándar */
--line-height-relaxed: 1.75;    /* Para lectura de párrafos */
```

### Espaciado de Letras (Letter Spacing)

```css
--letter-spacing-tight: -0.025em;   /* Títulos grandes */
--letter-spacing-normal: 0;         /* Texto normal */
--letter-spacing-wide: 0.025em;     /* Encabezados pequeños, todo en mayúsculas */
```

## Jerarquía Tipográfica

### Títulos

```html
<!-- H1 - Título Principal de Página -->
<h1>Gestión de Usuarios</h1>
<!-- 30px, Bold, Azul Benavides, Line Height Tight -->

<!-- H2 - Título de Sección -->
<h2>Información del Paciente</h2>
<!-- 24px, Semibold, Azul Benavides, Line Height Tight -->

<!-- H3 - Subtítulo -->
<h3>Datos Personales</h3>
<!-- 20px, Semibold, Line Height Normal -->

<!-- H4 - Encabezado Menor -->
<h4>Contacto de Emergencia</h4>
<!-- 18px, Medium, Line Height Normal -->

<!-- H5 - Encabezado Pequeño -->
<h5>Observaciones</h5>
<!-- 16px, Medium, Line Height Normal -->

<!-- H6 - Encabezado Etiqueta -->
<h6>INFORMACIÓN MÉDICA</h6>
<!-- 14px, Medium, Uppercase, Wide Spacing -->
```

### Cuerpo de Texto

```html
<!-- Párrafo Normal -->
<p>Este es el texto principal de la aplicación.</p>
<!-- 16px, Normal, Line Height Relaxed -->

<!-- Texto Pequeño -->
<small>Última actualización: 10 de octubre, 2025</small>
<!-- 12px, Normal, Line Height Normal -->

<!-- Énfasis -->
<strong>Texto importante</strong>
<!-- Semibold -->

<em>Texto enfatizado</em>
<!-- Italic -->
```

### Campos de Formulario

```html
<!-- Label -->
<label>Nombre Completo</label>
<!-- 14px, Medium, Line Height Normal -->

<!-- Input/Textarea/Select -->
<input type="text" />
<!-- 16px, Normal, Line Height Normal -->
```

## Clases de Utilidad Personalizadas

Puedes usar estas clases cuando necesites aplicar estilos tipográficos específicos:

```html
<!-- Display - Para títulos heroicos -->
<div class="text-display">Bienvenido a Benavides</div>

<!-- Headings Alternativos -->
<div class="text-heading-1">Título Grande</div>
<div class="text-heading-2">Título Mediano</div>

<!-- Body Text Variants -->
<div class="text-body-large">Texto de cuerpo grande</div>
<div class="text-body">Texto de cuerpo normal</div>
<div class="text-body-small">Texto de cuerpo pequeño</div>

<!-- Caption -->
<div class="text-caption">Texto de anotación</div>
```

## Uso en Componentes React

### Opción 1: Dejar que el Sistema lo Maneje (Recomendado)

El design system aplica automáticamente los estilos a todos los elementos HTML estándar:

```tsx
export function MiComponente() {
  return (
    <div>
      <h1>Título Principal</h1>
      <p>Este párrafo ya tiene los estilos aplicados.</p>
      <label>Campo de texto</label>
      <input type="text" />
    </div>
  );
}
```

### Opción 2: Variables CSS en Estilos Inline

```tsx
export function MiComponente() {
  return (
    <div style={{
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--font-weight-medium)',
      lineHeight: 'var(--line-height-normal)'
    }}>
      Texto personalizado
    </div>
  );
}
```

### Opción 3: Clases de Utilidad

```tsx
export function MiComponente() {
  return (
    <div className="text-body-large">
      Texto usando clase de utilidad
    </div>
  );
}
```

## Colores Corporativos

```css
--benavides-blue: #223482;   /* Azul institucional */
--benavides-red: #e2211c;    /* Rojo corporativo */
```

### Uso de Colores en Tipografía

- **Títulos H1 y H2**: Por defecto usan el azul Benavides
- **Resto del texto**: Color foreground estándar
- **Énfasis especial**: Puedes usar `text-[var(--benavides-red)]` para alertas o información crítica

## Mejores Prácticas

### ✅ Hacer

- Usar los elementos HTML semánticos (h1, h2, p, label, etc.) y dejar que el sistema aplique los estilos
- Usar las variables CSS cuando necesites estilos personalizados
- Mantener la jerarquía tipográfica consistente
- Usar h1 una sola vez por página (título principal)
- Seguir el orden lógico de encabezados (h1 → h2 → h3, sin saltar niveles)

### ❌ Evitar

- Usar clases de Tailwind para tamaños de fuente (text-xl, text-2xl) a menos que sea absolutamente necesario
- Usar clases de Tailwind para pesos de fuente (font-bold) a menos que sea necesario
- Saltar niveles de encabezado (h1 → h3)
- Usar h1 múltiples veces en la misma página
- Hardcodear valores de fuente en píxeles

## Responsive Typography

El sistema usa `rem` para todos los tamaños, lo que permite que la tipografía escale automáticamente:

```css
--font-size: 16px; /* Base en :root */
```

Si en el futuro necesitas ajustar el tamaño base para móviles, puedes hacer:

```css
@media (max-width: 768px) {
  :root {
    --font-size: 14px; /* Todos los rem se ajustarán automáticamente */
  }
}
```

## Accesibilidad

- **Contraste**: Los colores cumplen con WCAG AA
- **Tamaños mínimos**: El texto más pequeño es 12px (--text-xs), adecuado para anotaciones
- **Legibilidad**: Line heights optimizados para lectura cómoda
- **Font smoothing**: Activado para mejor renderizado en pantallas

## Ejemplos de Uso en la Aplicación

### Dashboard
```tsx
<div>
  <h1>Dashboard - {userName}</h1>
  <p>Bienvenido al sistema de historial clínico.</p>
</div>
```

### Formularios
```tsx
<div>
  <label>CURP</label>
  <input type="text" />
  <small>Ingresa el CURP de 18 caracteres</small>
</div>
```

### Cards
```tsx
<Card>
  <CardHeader>
    <h3>Información del Paciente</h3>
  </CardHeader>
  <CardContent>
    <p>Contenido de la tarjeta</p>
  </CardContent>
</Card>
```

---

## Próximos Pasos

Si necesitas personalizar más el design system:

1. **Cambiar la fuente base**: Modifica `--font-family-base` en `/styles/globals.css`
2. **Ajustar tamaños**: Modifica las variables `--text-*`
3. **Crear nuevas utilidades**: Agrega clases en la sección `@layer utilities`
4. **Temas oscuros**: Los pesos y familias ya están definidos en `.dark`
