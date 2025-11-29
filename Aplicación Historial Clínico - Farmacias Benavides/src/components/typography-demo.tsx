import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Separator } from './ui/separator';

/**
 * Componente de demostración del Design System de Tipografía
 * Muestra todos los estilos tipográficos disponibles
 */
export function TypographyDemo() {
  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-8">
      <div>
        <h1>Design System - Farmacias Benavides</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Sistema de tipografía basado en la fuente Inter con tokens de diseño consistentes
        </p>
      </div>

      <Separator />

      {/* Encabezados */}
      <Card>
        <CardHeader>
          <h2>Jerarquía de Encabezados</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h1>Heading 1 - Título Principal</h1>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: 'var(--text-sm)' }}>
              30px, Bold, Azul Benavides, Line Height Tight
            </p>
          </div>

          <div>
            <h2>Heading 2 - Título de Sección</h2>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: 'var(--text-sm)' }}>
              24px, Semibold, Azul Benavides, Line Height Tight
            </p>
          </div>

          <div>
            <h3>Heading 3 - Subtítulo</h3>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: 'var(--text-sm)' }}>
              20px, Semibold, Line Height Normal
            </p>
          </div>

          <div>
            <h4>Heading 4 - Encabezado Menor</h4>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: 'var(--text-sm)' }}>
              18px, Medium, Line Height Normal
            </p>
          </div>

          <div>
            <h5>Heading 5 - Encabezado Pequeño</h5>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: 'var(--text-sm)' }}>
              16px, Medium, Line Height Normal
            </p>
          </div>

          <div>
            <h6>Heading 6 - Etiqueta</h6>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: 'var(--text-sm)' }}>
              14px, Medium, Uppercase, Wide Spacing
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cuerpo de Texto */}
      <Card>
        <CardHeader>
          <h2>Texto de Cuerpo</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-body-large">
              Texto de Cuerpo Grande - Para destacar información importante o introducir secciones.
            </div>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>
              18px, Normal, Line Height Relaxed
            </p>
          </div>

          <div>
            <p>
              Texto de Párrafo Normal - Este es el tamaño estándar para todo el contenido de lectura
              en la aplicación. Optimizado para legibilidad con line-height relajado que facilita
              la lectura de bloques de texto largos.
            </p>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>
              16px, Normal, Line Height Relaxed
            </p>
          </div>

          <div>
            <div className="text-body-small">
              Texto de Cuerpo Pequeño - Para información secundaria o complementaria.
            </div>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>
              14px, Normal, Line Height Normal
            </p>
          </div>

          <div>
            <small>
              Texto muy pequeño - Para anotaciones, marcas de tiempo, o información terciaria.
            </small>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>
              12px, Normal, Line Height Normal
            </p>
          </div>

          <div>
            <div className="text-caption">
              Caption - Ideal para metadatos o información auxiliar.
            </div>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>
              12px, Normal, Line Height Normal (clase de utilidad)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Énfasis */}
      <Card>
        <CardHeader>
          <h2>Énfasis y Variaciones</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p>
              Texto normal con <strong>texto en negrita (semibold)</strong> y <em>texto en cursiva</em>.
            </p>
          </div>

          <div>
            <p>
              <span style={{ color: 'var(--benavides-red)' }}>
                Texto con color rojo Benavides para alertas o información crítica.
              </span>
            </p>
          </div>

          <div>
            <p>
              <span style={{ color: 'var(--benavides-blue)' }}>
                Texto con color azul Benavides para información institucional.
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Formularios */}
      <Card>
        <CardHeader>
          <h2>Elementos de Formulario</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="demo-input">Etiqueta de Campo</label>
            <input
              id="demo-input"
              type="text"
              placeholder="Ingresa texto aquí"
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg"
            />
            <small>Texto de ayuda o descripción del campo (12px)</small>
          </div>

          <div className="space-y-2">
            <label htmlFor="demo-select">Campo de Selección</label>
            <select
              id="demo-select"
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg"
            >
              <option>Opción 1</option>
              <option>Opción 2</option>
              <option>Opción 3</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="demo-textarea">Área de Texto</label>
            <textarea
              id="demo-textarea"
              placeholder="Escribe aquí..."
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg min-h-24"
            />
          </div>
        </CardContent>
      </Card>

      {/* Utilidades Personalizadas */}
      <Card>
        <CardHeader>
          <h2>Clases de Utilidad Personalizadas</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-display">
              Display Text
            </div>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>
              36px, Bold, Line Height Tight - Para títulos heroicos
            </p>
          </div>

          <div>
            <div className="text-heading-1">
              Heading 1 Custom
            </div>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>
              30px, Bold, Line Height Tight
            </p>
          </div>

          <div>
            <div className="text-heading-2">
              Heading 2 Custom
            </div>
            <p className="text-[var(--muted-foreground)]" style={{ fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>
              24px, Semibold, Line Height Tight
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tokens de Variables */}
      <Card>
        <CardHeader>
          <h2>Variables CSS Disponibles</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4>Tamaños de Fuente</h4>
              <ul className="space-y-1 mt-2">
                <li style={{ fontSize: 'var(--text-xs)' }}>--text-xs: 12px</li>
                <li style={{ fontSize: 'var(--text-sm)' }}>--text-sm: 14px</li>
                <li style={{ fontSize: 'var(--text-base)' }}>--text-base: 16px</li>
                <li style={{ fontSize: 'var(--text-lg)' }}>--text-lg: 18px</li>
                <li style={{ fontSize: 'var(--text-xl)' }}>--text-xl: 20px</li>
                <li style={{ fontSize: 'var(--text-2xl)' }}>--text-2xl: 24px</li>
                <li style={{ fontSize: 'var(--text-3xl)' }}>--text-3xl: 30px</li>
                <li style={{ fontSize: 'var(--text-4xl)' }}>--text-4xl: 36px</li>
              </ul>
            </div>

            <div>
              <h4>Pesos de Fuente</h4>
              <ul className="space-y-1 mt-2">
                <li style={{ fontWeight: 'var(--font-weight-light)' }}>--font-weight-light: 300</li>
                <li style={{ fontWeight: 'var(--font-weight-normal)' }}>--font-weight-normal: 400</li>
                <li style={{ fontWeight: 'var(--font-weight-medium)' }}>--font-weight-medium: 500</li>
                <li style={{ fontWeight: 'var(--font-weight-semibold)' }}>--font-weight-semibold: 600</li>
                <li style={{ fontWeight: 'var(--font-weight-bold)' }}>--font-weight-bold: 700</li>
              </ul>
            </div>

            <div>
              <h4>Line Heights</h4>
              <ul className="space-y-1 mt-2">
                <li>--line-height-none: 1</li>
                <li>--line-height-tight: 1.25</li>
                <li>--line-height-normal: 1.5</li>
                <li>--line-height-relaxed: 1.75</li>
              </ul>
            </div>

            <div>
              <h4>Letter Spacing</h4>
              <ul className="space-y-1 mt-2">
                <li style={{ letterSpacing: 'var(--letter-spacing-tight)' }}>--letter-spacing-tight</li>
                <li style={{ letterSpacing: 'var(--letter-spacing-normal)' }}>--letter-spacing-normal</li>
                <li style={{ letterSpacing: 'var(--letter-spacing-wide)' }}>--letter-spacing-wide</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ejemplo Práctico */}
      <Card className="bg-[var(--benavides-blue)] text-white">
        <CardHeader>
          <h2 className="text-white">Ejemplo: Tarjeta de Paciente</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="text-white">Juan Pérez González</h3>
            <p className="text-white/90" style={{ fontSize: 'var(--text-sm)' }}>CURP: PEGJ850315HDFRNN09</p>
          </div>
          <Separator className="bg-white/20" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h6 className="text-white/70">EDAD</h6>
              <p className="text-white">40 años</p>
            </div>
            <div>
              <h6 className="text-white/70">TIPO DE SANGRE</h6>
              <p className="text-white">O+</p>
            </div>
          </div>
          <div>
            <h6 className="text-white/70">ÚLTIMA CONSULTA</h6>
            <p className="text-white">10 de octubre, 2025</p>
            <small className="text-white/70">Hace 3 días</small>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
