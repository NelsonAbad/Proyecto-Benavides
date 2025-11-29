import React, { useState } from 'react';
import { useAuth } from './auth-context';
import { useDesignSystem } from './design-system-context';
import { Header } from './header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { 
  Type, 
  Palette, 
  Sliders, 
  RotateCcw, 
  Save, 
  Eye,
  Settings2,
  Circle
} from 'lucide-react';

const fontOptions = [
  { value: 'AG Book Rounded', label: 'AG Book Rounded' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Quicksand', label: 'Quicksand' },
  { value: 'Varela Round', label: 'Varela Round' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'System UI', label: 'System Default' },
];

export function DesignSystemEditor() {
  const { user, addLog } = useAuth();
  const { config, updateConfig, resetConfig } = useDesignSystem();
  const [activeTab, setActiveTab] = useState('typography');

  const handleSave = () => {
    toast.success('Configuración guardada exitosamente');
    addLog('Actualización del Design System', 'Design System');
  };

  const handleReset = () => {
    resetConfig();
    toast.success('Design System restaurado a valores predeterminados');
    addLog('Reseteo del Design System', 'Design System');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2">Design System Editor</h1>
            <p className="text-muted-foreground">
              Personaliza la apariencia de toda la aplicación desde un solo lugar
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Restaurar
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Controles */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="typography" className="gap-2">
                  <Type className="h-4 w-4" />
                  Tipografía
                </TabsTrigger>
                <TabsTrigger value="colors" className="gap-2">
                  <Palette className="h-4 w-4" />
                  Colores
                </TabsTrigger>
                <TabsTrigger value="spacing" className="gap-2">
                  <Sliders className="h-4 w-4" />
                  Espaciado
                </TabsTrigger>
              </TabsList>

              {/* Tab de Tipografía */}
              <TabsContent value="typography" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Fuentes</CardTitle>
                    <CardDescription>
                      Configura las familias tipográficas principales
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Fuente Base (Cuerpo)</Label>
                      <Select 
                        value={config.fontFamilyBase} 
                        onValueChange={(value) => updateConfig({ fontFamilyBase: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map(font => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Fuente de Encabezados</Label>
                      <Select 
                        value={config.fontFamilyHeading} 
                        onValueChange={(value) => updateConfig({ fontFamilyHeading: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map(font => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tamaño Base</CardTitle>
                    <CardDescription>
                      Ajusta el tamaño de fuente principal (afecta toda la escala)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Tamaño Base</Label>
                        <span className="text-sm text-muted-foreground">{config.baseFontSize}px</span>
                      </div>
                      <Slider
                        value={[config.baseFontSize]}
                        onValueChange={([value]) => updateConfig({ baseFontSize: value })}
                        min={12}
                        max={20}
                        step={1}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pesos de Fuente</CardTitle>
                    <CardDescription>
                      Ajusta los pesos tipográficos utilizados
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Light</Label>
                        <Input
                          type="number"
                          value={config.fontWeightLight}
                          onChange={(e) => updateConfig({ fontWeightLight: parseInt(e.target.value) })}
                          min={100}
                          max={900}
                          step={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Normal</Label>
                        <Input
                          type="number"
                          value={config.fontWeightNormal}
                          onChange={(e) => updateConfig({ fontWeightNormal: parseInt(e.target.value) })}
                          min={100}
                          max={900}
                          step={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Medium</Label>
                        <Input
                          type="number"
                          value={config.fontWeightMedium}
                          onChange={(e) => updateConfig({ fontWeightMedium: parseInt(e.target.value) })}
                          min={100}
                          max={900}
                          step={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Semibold</Label>
                        <Input
                          type="number"
                          value={config.fontWeightSemibold}
                          onChange={(e) => updateConfig({ fontWeightSemibold: parseInt(e.target.value) })}
                          min={100}
                          max={900}
                          step={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bold</Label>
                        <Input
                          type="number"
                          value={config.fontWeightBold}
                          onChange={(e) => updateConfig({ fontWeightBold: parseInt(e.target.value) })}
                          min={100}
                          max={900}
                          step={100}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Escala Tipográfica</CardTitle>
                    <CardDescription>
                      Multiplicadores relativos al tamaño base
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>XS (actual: {(config.textXs * config.baseFontSize).toFixed(0)}px)</Label>
                        <Slider
                          value={[config.textXs * 100]}
                          onValueChange={([value]) => updateConfig({ textXs: value / 100 })}
                          min={50}
                          max={100}
                          step={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SM (actual: {(config.textSm * config.baseFontSize).toFixed(0)}px)</Label>
                        <Slider
                          value={[config.textSm * 100]}
                          onValueChange={([value]) => updateConfig({ textSm: value / 100 })}
                          min={70}
                          max={110}
                          step={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>LG (actual: {(config.textLg * config.baseFontSize).toFixed(0)}px)</Label>
                        <Slider
                          value={[config.textLg * 100]}
                          onValueChange={([value]) => updateConfig({ textLg: value / 100 })}
                          min={100}
                          max={150}
                          step={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>XL (actual: {(config.textXl * config.baseFontSize).toFixed(0)}px)</Label>
                        <Slider
                          value={[config.textXl * 100]}
                          onValueChange={([value]) => updateConfig({ textXl: value / 100 })}
                          min={110}
                          max={170}
                          step={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>2XL (actual: {(config.text2xl * config.baseFontSize).toFixed(0)}px)</Label>
                        <Slider
                          value={[config.text2xl * 100]}
                          onValueChange={([value]) => updateConfig({ text2xl: value / 100 })}
                          min={130}
                          max={200}
                          step={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>3XL (actual: {(config.text3xl * config.baseFontSize).toFixed(0)}px)</Label>
                        <Slider
                          value={[config.text3xl * 100]}
                          onValueChange={([value]) => updateConfig({ text3xl: value / 100 })}
                          min={160}
                          max={250}
                          step={5}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab de Colores */}
              <TabsContent value="colors" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Colores Corporativos</CardTitle>
                    <CardDescription>
                      Define los colores principales de la marca Benavides
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Azul Benavides (Primary)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.benavidesBlue}
                          onChange={(e) => updateConfig({ benavidesBlue: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={config.benavidesBlue}
                          onChange={(e) => updateConfig({ benavidesBlue: e.target.value })}
                          placeholder="#223482"
                          className="flex-1"
                        />
                      </div>
                      <div 
                        className="w-full h-16 rounded-lg border"
                        style={{ backgroundColor: config.benavidesBlue }}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Rojo Benavides (Secondary)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.benavidesRed}
                          onChange={(e) => updateConfig({ benavidesRed: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={config.benavidesRed}
                          onChange={(e) => updateConfig({ benavidesRed: e.target.value })}
                          placeholder="#e2211c"
                          className="flex-1"
                        />
                      </div>
                      <div 
                        className="w-full h-16 rounded-lg border"
                        style={{ backgroundColor: config.benavidesRed }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab de Espaciado */}
              <TabsContent value="spacing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Line Height</CardTitle>
                    <CardDescription>
                      Controla el interlineado del texto
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tight (actual: {config.lineHeightTight})</Label>
                      <Slider
                        value={[config.lineHeightTight * 100]}
                        onValueChange={([value]) => updateConfig({ lineHeightTight: value / 100 })}
                        min={100}
                        max={150}
                        step={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Normal (actual: {config.lineHeightNormal})</Label>
                      <Slider
                        value={[config.lineHeightNormal * 100]}
                        onValueChange={([value]) => updateConfig({ lineHeightNormal: value / 100 })}
                        min={130}
                        max={180}
                        step={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Relaxed (actual: {config.lineHeightRelaxed})</Label>
                      <Slider
                        value={[config.lineHeightRelaxed * 100]}
                        onValueChange={([value]) => updateConfig({ lineHeightRelaxed: value / 100 })}
                        min={150}
                        max={200}
                        step={5}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Border Radius</CardTitle>
                    <CardDescription>
                      Redondeo de bordes en tarjetas y componentes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Radio Base</Label>
                        <span className="text-sm text-muted-foreground">{config.radius}px</span>
                      </div>
                      <Slider
                        value={[config.radius]}
                        onValueChange={([value]) => updateConfig({ radius: value })}
                        min={0}
                        max={24}
                        step={1}
                      />
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        <div 
                          className="h-16 bg-primary"
                          style={{ borderRadius: `${config.radius}px` }}
                        />
                        <div 
                          className="h-16 bg-secondary"
                          style={{ borderRadius: `${config.radius}px` }}
                        />
                        <div 
                          className="h-16 bg-muted"
                          style={{ borderRadius: `${config.radius}px` }}
                        />
                        <div 
                          className="h-16 bg-accent"
                          style={{ borderRadius: `${config.radius}px` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Panel de Preview */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Vista Previa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h1>Título Principal</h1>
                  <h2>Título de Sección</h2>
                  <h3>Subtítulo</h3>
                  <h4>Encabezado Menor</h4>
                  <p>Este es un párrafo de ejemplo con el texto normal de la aplicación.</p>
                  <small>Texto pequeño para metadatos</small>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Badge style={{ backgroundColor: config.benavidesBlue }}>
                    Primary
                  </Badge>
                  <Badge style={{ backgroundColor: config.benavidesRed }}>
                    Secondary
                  </Badge>
                </div>

                <Separator />

                <Button className="w-full">
                  Botón de Ejemplo
                </Button>

                <div className="space-y-2">
                  <Label>Campo de Entrada</Label>
                  <Input placeholder="Texto de ejemplo" />
                </div>

                <div 
                  className="p-4 bg-muted"
                  style={{ borderRadius: `${config.radius}px` }}
                >
                  <p className="text-sm">
                    Tarjeta con radio de {config.radius}px
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Settings2 className="h-4 w-4" />
                  Configuración Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fuente:</span>
                  <span className="font-medium">{config.fontFamilyBase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tamaño Base:</span>
                  <span className="font-medium">{config.baseFontSize}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Radio:</span>
                  <span className="font-medium">{config.radius}px</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
