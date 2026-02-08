# Theme Management Skill

## Purpose
Manage and apply consistent themes across applications using CSS variables, Tailwind CSS, and React Context API.

## When to Use
- Implementing dark/light mode toggling
- Applying consistent color palettes across the application
- Managing theme switching functionality
- Creating custom themes with specific color schemes
- Ensuring consistent styling across components
- Supporting accessibility with high contrast themes

## Configuration Options

### 1. Theme Types
Select the appropriate theme type:

```yaml
theme_type: neon          # Vibrant neon color scheme
theme_type: dark          # Dark mode theme
theme_type: light         # Light mode theme
theme_type: custom        # Custom theme with specific variables
```

### 2. Theme Variables
Define custom theme variables for custom themes:

```yaml
theme_variables:
  primary-color: "#00ff41"      # Neon green
  secondary-color: "#00ffff"    # Cyan
  background-color: "#0a0a0a"   # Dark background
  text-color: "#ffffff"         # White text
```

### 3. Component Targeting
Specify which components to apply the theme to:

```yaml
components: ["all"]             # Apply to all components
components: ["Button", "Card", "Header"]  # Apply to specific components
```

## Implementation Steps

### 1. CSS Variables Setup
Define theme variables in global styles:

```css
/* globals.css */
:root {
  /* Light theme variables */
  --color-primary: #0066cc;
  --color-secondary: #f0f0f0;
  --color-background: #ffffff;
  --color-text: #000000;
}

[data-theme='dark'] {
  --color-primary: #00aaff;
  --color-secondary: #333333;
  --color-background: #1a1a1a;
  --color-text: #ffffff;
}

[data-theme='neon'] {
  --color-primary: #00ff41;
  --color-secondary: #00ffff;
  --color-background: #0a0a0a;
  --color-text: #ffffff;
}
```

### 2. Theme Context Implementation
Create ThemeContext for managing theme state:

```tsx
// ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'neon' | 'custom';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (newTheme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) setTheme(savedTheme);

    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

### 3. Component Theming
Apply themes to components using CSS variables:

```tsx
// ThemedButton.tsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemedButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <button
      className={`
        px-4 py-2 rounded
        bg-[var(--color-primary)]
        text-[var(--color-text)]
        hover:bg-[var(--color-secondary)]
        transition-colors duration-200
        border border-[var(--color-primary)]
      `}
    >
      {children}
    </button>
  );
};
```

### 4. Tailwind Configuration
Configure Tailwind to support theme variables:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        text: 'var(--color-text)',
      }
    }
  },
  plugins: [],
}
```

## Theme Patterns

### 1. CSS Variables Pattern
```css
/* Use CSS variables for theming */
.component {
  background-color: var(--color-background);
  color: var(--color-text);
  border-color: var(--color-primary);
}
```

### 2. Data Attribute Pattern
```html
<!-- Apply theme via data attribute -->
<html data-theme="dark">
  <body class="bg-background text-text">
    <!-- Content -->
  </body>
</html>
```

### 3. Context-Based Pattern
```tsx
// Hook-based theme management
const { theme, toggleTheme } = useTheme();

return (
  <button onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}>
    Switch to {theme === 'dark' ? 'light' : 'dark'} mode
  </button>
);
```

## Benefits
- Consistent theming across the application
- Easy theme switching functionality
- Accessible color schemes
- Customizable theme options
- CSS variable-based flexibility
- React Context for state management
- Persistent theme preferences

## Best Practices
- Use semantic color names instead of literal colors
- Maintain proper contrast ratios for accessibility
- Store theme preferences in localStorage
- Provide smooth transitions between themes
- Test themes across different components
- Support system preference for automatic theming
- Use CSS variables for maximum flexibility
- Implement proper fallback colors