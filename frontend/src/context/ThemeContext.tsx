import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((isDark: boolean) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remover clase dark primero para asegurar limpieza
    root.classList.remove('dark');
    
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.removeAttribute('data-theme');
      root.style.colorScheme = 'light';
    }
    
    // Aplicar estilos directamente al body para forzar actualización
    body.style.backgroundColor = isDark 
      ? 'hsl(222.2, 84%, 4.9%)' 
      : 'hsl(0, 0%, 100%)';
    body.style.color = isDark 
      ? 'hsl(210, 40%, 98%)' 
      : 'hsl(222.2, 84%, 4.9%)';
    
    // Forzar actualización del root también
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.backgroundColor = isDark 
        ? 'hsl(222.2, 84%, 4.9%)' 
        : 'hsl(0, 0%, 100%)';
      rootElement.style.color = isDark 
        ? 'hsl(210, 40%, 98%)' 
        : 'hsl(222.2, 84%, 4.9%)';
    }
    
    // Forzar re-render de todos los elementos con clase dark:
    // Esto asegura que Tailwind procese las clases dark: correctamente
    const event = new CustomEvent('themechange', { detail: { isDark } });
    window.dispatchEvent(event);
  }, []);

  useEffect(() => {
    // Verificar preferencia guardada o del sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let shouldBeDark = false;
    
    if (savedTheme) {
      shouldBeDark = savedTheme === 'dark';
    } else {
      shouldBeDark = prefersDark;
    }
    
    setDarkMode(shouldBeDark);
    applyTheme(shouldBeDark);
    setMounted(true);
  }, [applyTheme]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newDarkMode = !prev;
      // Aplicar tema inmediatamente con el nuevo valor
      applyTheme(newDarkMode);
      // Guardar preferencia
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
      return newDarkMode;
    });
  }, [applyTheme]);

  // Siempre proporcionar el contexto, incluso antes de montar
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
