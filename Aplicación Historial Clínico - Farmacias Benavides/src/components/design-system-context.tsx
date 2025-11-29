import React, { createContext, useContext, useState, useEffect } from 'react';

interface DesignSystemConfig {
  // Tipografía
  fontFamilyBase: string;
  fontFamilyHeading: string;
  baseFontSize: number;
  
  // Colores
  benavidesBlue: string;
  benavidesRed: string;
  
  // Pesos de fuente
  fontWeightLight: number;
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;
  
  // Tamaños de texto (multiplicadores del base)
  textXs: number;
  textSm: number;
  textBase: number;
  textLg: number;
  textXl: number;
  text2xl: number;
  text3xl: number;
  text4xl: number;
  
  // Line Heights
  lineHeightNone: number;
  lineHeightTight: number;
  lineHeightNormal: number;
  lineHeightRelaxed: number;
  
  // Letter Spacing
  letterSpacingTight: string;
  letterSpacingNormal: string;
  letterSpacingWide: string;
  
  // Border Radius
  radius: number;
}

const defaultConfig: DesignSystemConfig = {
  fontFamilyBase: 'AG Book Rounded',
  fontFamilyHeading: 'AG Book Rounded',
  baseFontSize: 16,
  benavidesBlue: '#223482',
  benavidesRed: '#e2211c',
  fontWeightLight: 300,
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,
  textXs: 0.75,
  textSm: 0.875,
  textBase: 1,
  textLg: 1.125,
  textXl: 1.25,
  text2xl: 1.5,
  text3xl: 1.875,
  text4xl: 2.25,
  lineHeightNone: 1,
  lineHeightTight: 1.25,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
  letterSpacingTight: '-0.025em',
  letterSpacingNormal: '0',
  letterSpacingWide: '0.025em',
  radius: 10,
};

interface DesignSystemContextType {
  config: DesignSystemConfig;
  updateConfig: (updates: Partial<DesignSystemConfig>) => void;
  resetConfig: () => void;
  applyConfig: () => void;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within DesignSystemProvider');
  }
  return context;
};

export const DesignSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<DesignSystemConfig>(() => {
    // Cargar configuración guardada o usar la predeterminada
    const saved = localStorage.getItem('designSystemConfig');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  const applyConfig = () => {
    const root = document.documentElement;
    
    // Aplicar fuentes con fallbacks redondeados
    const fontFamily = `'${config.fontFamilyBase}', 'Nunito', 'Quicksand', 'Varela Round', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
    root.style.setProperty('--font-family-base', fontFamily);
    root.style.setProperty('--font-family-heading', `'${config.fontFamilyHeading}', 'Nunito', 'Quicksand', 'Varela Round', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`);
    
    // Aplicar tamaño base
    root.style.setProperty('--font-size', `${config.baseFontSize}px`);
    
    // Aplicar tamaños de texto
    root.style.setProperty('--text-xs', `${config.textXs}rem`);
    root.style.setProperty('--text-sm', `${config.textSm}rem`);
    root.style.setProperty('--text-base', `${config.textBase}rem`);
    root.style.setProperty('--text-lg', `${config.textLg}rem`);
    root.style.setProperty('--text-xl', `${config.textXl}rem`);
    root.style.setProperty('--text-2xl', `${config.text2xl}rem`);
    root.style.setProperty('--text-3xl', `${config.text3xl}rem`);
    root.style.setProperty('--text-4xl', `${config.text4xl}rem`);
    
    // Aplicar pesos de fuente
    root.style.setProperty('--font-weight-light', config.fontWeightLight.toString());
    root.style.setProperty('--font-weight-normal', config.fontWeightNormal.toString());
    root.style.setProperty('--font-weight-medium', config.fontWeightMedium.toString());
    root.style.setProperty('--font-weight-semibold', config.fontWeightSemibold.toString());
    root.style.setProperty('--font-weight-bold', config.fontWeightBold.toString());
    
    // Aplicar line heights
    root.style.setProperty('--line-height-none', config.lineHeightNone.toString());
    root.style.setProperty('--line-height-tight', config.lineHeightTight.toString());
    root.style.setProperty('--line-height-normal', config.lineHeightNormal.toString());
    root.style.setProperty('--line-height-relaxed', config.lineHeightRelaxed.toString());
    
    // Aplicar letter spacing
    root.style.setProperty('--letter-spacing-tight', config.letterSpacingTight);
    root.style.setProperty('--letter-spacing-normal', config.letterSpacingNormal);
    root.style.setProperty('--letter-spacing-wide', config.letterSpacingWide);
    
    // Aplicar colores
    root.style.setProperty('--benavides-blue', config.benavidesBlue);
    root.style.setProperty('--benavides-red', config.benavidesRed);
    root.style.setProperty('--primary', config.benavidesBlue);
    root.style.setProperty('--secondary', config.benavidesRed);
    
    // Aplicar radio
    root.style.setProperty('--radius', `${config.radius}px`);
  };

  useEffect(() => {
    applyConfig();
  }, [config]);

  const updateConfig = (updates: Partial<DesignSystemConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    localStorage.setItem('designSystemConfig', JSON.stringify(newConfig));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.setItem('designSystemConfig', JSON.stringify(defaultConfig));
  };

  return (
    <DesignSystemContext.Provider value={{ config, updateConfig, resetConfig, applyConfig }}>
      {children}
    </DesignSystemContext.Provider>
  );
};
