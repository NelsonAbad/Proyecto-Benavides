# Configuración de AG Book Rounded - Farmacias Benavides

## 📋 Información General

**AG Book Rounded** es la fuente corporativa oficial de Farmacias Benavides, diseñada por Linotype. Es una fuente **comercial** que requiere licencia para uso en producción.

### Características de la Fuente

- **Familia:** AG Book Rounded
- **Diseñador:** Linotype
- **Estilo:** Sans-serif redondeada
- **Pesos disponibles en el diseño:**
  - **Regular (400)** - Para párrafos y títulos
  - **Medium (500)** - Para títulos y cabeceras y textos cortos
  - **Bold (700)** - Para cabeceras y textos cortos

## 🎯 Estado Actual

### Configuración Activa
✅ La aplicación está **configurada** para usar AG Book Rounded  
✅ Todas las variables CSS apuntan a AG Book Rounded  
✅ El Design System está configurado con AG Book Rounded como predeterminado  

### Fuentes Fallback Activas
Mientras no se agreguen los archivos de AG Book Rounded, la aplicación usa:
1. **Nunito** (fallback principal - muy similar, redondeada, gratuita)
2. **Quicksand** (fallback secundario - redondeada, geométrica)
3. **Varela Round** (fallback terciario - redondeada, simple)

## 📦 Opciones de Implementación

### Opción 1: Archivos de Fuente Locales (Recomendado para Producción)

Si tiene licencia y archivos de AG Book Rounded:

1. **Crear directorio de fuentes:**
   ```
   /public/fonts/
   ```

2. **Agregar archivos de fuente:**
   Coloque los archivos `.woff2` y `.woff` en el directorio:
   - `AGBookRounded-Regular.woff2`
   - `AGBookRounded-Regular.woff`
   - `AGBookRounded-Medium.woff2`
   - `AGBookRounded-Medium.woff`
   - `AGBookRounded-Bold.woff2`
   - `AGBookRounded-Bold.woff`

3. **Activar declaraciones @font-face:**
   Editar `/styles/fonts.css` y descomentar las declaraciones @font-face

4. **Importar en globals.css:**
   Agregar al inicio de `/styles/globals.css`:
   ```css
   @import url('./fonts.css');
   ```

### Opción 2: Adobe Fonts / Typekit

Si tiene licencia a través de Adobe Fonts:

1. **Agregar en el HTML principal:**
   ```html
   <link rel="stylesheet" href="https://use.typekit.net/[TU-KIT-ID].css">
   ```

2. **Verificar nombre de familia:**
   Asegúrese de que el nombre en Adobe Fonts coincida con "AG Book Rounded"

### Opción 3: Servicio de Fuentes Web

Si tiene licencia a través de otro servicio (Fonts.com, MyFonts, etc.):

1. Siga las instrucciones del proveedor
2. Asegúrese de que el `font-family` sea exactamente `'AG Book Rounded'`

## 🔍 Verificación

Para verificar que AG Book Rounded se cargó correctamente:

1. **Inspeccionar en DevTools:**
   - Abrir DevTools (F12)
   - Ir a Elements
   - Inspeccionar cualquier texto
   - En la pestaña Computed, buscar "font-family"
   - Debe mostrar "AG Book Rounded"

2. **Prueba visual:**
   - Los caracteres deben verse redondeados
   - Especialmente notable en letras como: a, o, e, g, b, d, p, q

3. **Network Tab:**
   - Buscar las solicitudes de fuentes
   - Verificar que se descargaron exitosamente (200 OK)

## 📝 Pesos de Fuente Configurados

La aplicación usa los siguientes pesos según el diseño de Benavides:

| Peso CSS | AG Book Rounded | Uso Principal |
|----------|----------------|---------------|
| 400 | Regular | Párrafos, texto de cuerpo |
| 500 | Medium | Títulos, labels, botones |
| 700 | Bold | Encabezados principales (h1, h2) |

## 🎨 Uso en la Aplicación

La fuente se aplica automáticamente a través del Design System:

```css
/* Automáticamente aplicado a: */
- Todos los encabezados (h1-h6)
- Texto de cuerpo (p, div)
- Botones
- Labels de formularios
- Inputs y campos de texto
- Navegación
- Cards y componentes
```

## ⚖️ Consideraciones Legales

⚠️ **IMPORTANTE:**

- AG Book Rounded es una fuente comercial con derechos de autor
- Requiere licencia válida para uso en producción
- No incluir archivos de fuente sin licencia apropiada
- Verificar términos de uso para aplicaciones web
- Considerar licencias por dominio/vistas de página según proveedor

## 🔄 Alternativas Gratuitas

Si no puede obtener licencia de AG Book Rounded, las siguientes fuentes gratuitas ofrecen apariencia similar:

1. **Nunito** (Actualmente activa)
   - Muy similar a AG Book Rounded
   - Completamente gratuita
   - Disponible en Google Fonts

2. **Quicksand**
   - Redondeada geométrica
   - Gratuita
   - Disponible en Google Fonts

3. **Varela Round**
   - Simple y redondeada
   - Gratuita
   - Disponible en Google Fonts

Para cambiar permanentemente a una de estas:
1. Ir al Design System Editor (`/design-system`)
2. Cambiar la fuente base a la deseada
3. Guardar cambios

## 📞 Contacto para Licencias

Para obtener licencia de AG Book Rounded:

- **Linotype:** https://www.linotype.com/
- **MyFonts:** https://www.myfonts.com/
- **Fonts.com:** https://www.fonts.com/
- **Adobe Fonts:** https://fonts.adobe.com/ (incluido con Creative Cloud)

## ✅ Checklist de Implementación

- [ ] Obtener licencia válida de AG Book Rounded
- [ ] Descargar archivos de fuente en formatos WOFF2 y WOFF
- [ ] Crear directorio `/public/fonts/`
- [ ] Copiar archivos de fuente al directorio
- [ ] Descomentar @font-face en `/styles/fonts.css`
- [ ] Importar fonts.css en globals.css
- [ ] Verificar carga en DevTools
- [ ] Probar en diferentes navegadores
- [ ] Documentar licencia para equipo legal

---

**Última actualización:** Octubre 2025  
**Responsable:** Equipo de Desarrollo Farmacias Benavides
