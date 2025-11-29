# Guía Rápida de Tipografía

## ¿Cómo usar el Design System?

El design system de Farmacias Benavides está configurado para que **no necesites usar clases de Tailwind** para tamaños de fuente, pesos o line-heights. El sistema aplica automáticamente los estilos correctos.

## ✅ Forma Correcta (Recomendada)

```tsx
// ✅ HACER: Usa elementos HTML semánticos
export function MiComponente() {
  return (
    <div>
      <h1>Título Principal</h1>
      <h2>Subtítulo de Sección</h2>
      <p>Este es un párrafo normal.</p>
      <label>Nombre del Campo</label>
      <input type="text" />
    </div>
  );
}
```

El sistema aplicará automáticamente:
- **h1**: 30px, Bold, Azul Benavides
- **h2**: 24px, Semibold, Azul Benavides  
- **p**: 16px, Normal, line-height relajado
- **label**: 14px, Medium
- **input**: 16px, Normal

## ❌ Evitar (Solo cuando sea necesario)

```tsx
// ❌ EVITAR: No usar clases de Tailwind para tipografía a menos que sea absolutamente necesario
<div className="text-2xl font-bold">Título</div>  // ❌
<h1>Título</h1>  // ✅

<p className="text-lg font-medium">Texto</p>  // ❌
<p>Texto</p>  // ✅
```

## Cuándo SÍ usar clases de Tailwind

Solo usa clases de tipografía de Tailwind cuando:

1. **Necesitas un tamaño que no corresponde a ningún elemento HTML**
```tsx
<span className="text-lg">Texto especial de 18px</span>
```

2. **Necesitas sobrescribir el estilo por un requisito específico**
```tsx
<h2 className="text-base">Subtítulo pequeño (excepcional)</h2>
```

## Usar Variables CSS

Para estilos personalizados, usa las variables CSS:

```tsx
// Opción 1: Estilos inline con variables
<div style={{
  fontSize: 'var(--text-lg)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--benavides-blue)'
}}>
  Texto personalizado
</div>

// Opción 2: Clases de utilidad personalizadas
<div className="text-body-large">
  Texto de cuerpo grande
</div>
```

## Jerarquía de Elementos HTML

### Títulos
- **h1**: Solo uno por página - Título principal
- **h2**: Títulos de sección
- **h3**: Subtítulos importantes
- **h4**: Encabezados de subsección
- **h5**: Encabezados menores
- **h6**: Etiquetas (todo en mayúsculas)

### Texto
- **p**: Párrafos de lectura
- **span**: Texto inline sin estilo específico
- **small**: Texto auxiliar, timestamps
- **strong**: Énfasis fuerte (negrita)
- **em**: Énfasis (cursiva)

### Formularios
- **label**: Etiquetas de campos
- **input**: Campos de texto
- **textarea**: Áreas de texto
- **select**: Selectores

## Ejemplo Real: Tarjeta de Paciente

```tsx
export function PatientCard({ patient }) {
  return (
    <Card>
      <CardHeader>
        {/* h2 automáticamente: 24px, Semibold, Azul */}
        <h2>{patient.name}</h2>
        
        {/* small automáticamente: 12px, Normal */}
        <small>CURP: {patient.curp}</small>
      </CardHeader>
      
      <CardContent>
        {/* h3 automáticamente: 20px, Semibold */}
        <h3>Información Médica</h3>
        
        {/* p automáticamente: 16px, Normal, line-height relajado */}
        <p>Tipo de sangre: {patient.bloodType}</p>
        <p>Alergias: {patient.allergies}</p>
        
        {/* h6 automáticamente: 14px, Medium, Uppercase */}
        <h6>Última Consulta</h6>
        <p>{patient.lastVisit}</p>
      </CardContent>
    </Card>
  );
}
```

## Colores Corporativos en Tipografía

```tsx
// Azul Benavides (automático en h1 y h2)
<h1>Ya tiene azul automático</h1>

// Rojo Benavides para alertas
<p style={{ color: 'var(--benavides-red)' }}>
  Información importante o de alerta
</p>

// O usando Tailwind
<p className="text-[var(--benavides-red)]">
  Alerta
</p>
```

## Clases de Utilidad Personalizadas

Si necesitas aplicar estilos consistentes sin usar elementos HTML:

```tsx
<div className="text-display">Título Heroico (36px)</div>
<div className="text-heading-1">Título H1 (30px)</div>
<div className="text-heading-2">Título H2 (24px)</div>
<div className="text-body-large">Cuerpo grande (18px)</div>
<div className="text-body">Cuerpo normal (16px)</div>
<div className="text-body-small">Cuerpo pequeño (14px)</div>
<div className="text-caption">Caption (12px)</div>
```

## Variables Disponibles

### Tamaños
```css
--text-xs: 12px
--text-sm: 14px
--text-base: 16px
--text-lg: 18px
--text-xl: 20px
--text-2xl: 24px
--text-3xl: 30px
--text-4xl: 36px
```

### Pesos
```css
--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### Fuentes
```css
--font-family-base: 'Inter', sans-serif
--font-family-heading: 'Inter', sans-serif
--font-family-mono: 'SF Mono', monospace
```

## Cambiar la Fuente Base

Si en el futuro quieres cambiar la fuente:

1. Abre `/styles/globals.css`
2. Modifica la importación de Google Fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=TuFuente:wght@300;400;500;600;700&display=swap');
```
3. Actualiza la variable:
```css
--font-family-base: 'TuFuente', sans-serif;
```

## Visualizar el Design System

Como administrador, puedes ver todos los estilos en acción:

1. Inicia sesión con rol de admin
2. En el Dashboard, haz clic en "Design System"
3. Verás ejemplos de todos los estilos tipográficos

## Resumen

✅ **Usar elementos HTML semánticos** (h1, h2, p, label, etc.)  
✅ **Dejar que el sistema aplique los estilos** automáticamente  
✅ **Usar variables CSS** para casos especiales  
❌ **Evitar clases de Tailwind** para tipografía (text-xl, font-bold, etc.)  
❌ **No hardcodear tamaños** en píxeles  

El design system maneja todo por ti. ¡Solo usa HTML semántico!
