# Responsive Design Implementation Skill

## Purpose
Implement responsive design patterns for UI components using mobile-first approach with breakpoint-based layouts.

## When to Use
- Making existing components responsive across different screen sizes
- Implementing mobile-first design patterns
- Adding responsive layouts using CSS frameworks (Tailwind, etc.)
- Creating adaptive interfaces for various devices
- Enhancing user experience across different viewport sizes

## Configuration Options

### 1. Layout Type Selection
Choose the appropriate layout system:

```yaml
layout_type: grid           # CSS Grid for complex layouts
layout_type: flex           # Flexbox for flexible arrangements
layout_type: stack          # Stacked layouts for mobile-first
```

### 2. Breakpoint Configuration
Define responsive breakpoints:

```yaml
breakpoints: ["sm", "md", "lg", "xl"]  # Default Tailwind breakpoints
# Alternative custom breakpoints:
breakpoints: ["320px", "768px", "1024px", "1280px"]
```

### 3. Target Component
Specify which component to make responsive:

```yaml
target_component: "Button"  # Component name to modify
```

## Implementation Steps

### 1. Component Analysis
Analyze the current component structure to identify responsive requirements:

```bash
# Analyze component structure
- Identify layout elements
- Determine responsive requirements
- Assess current CSS classes
- Plan responsive modifications
```

### 2. Mobile-First Implementation
Apply responsive classes following mobile-first approach:

```tsx
// Example responsive component implementation
const ResponsiveComponent = () => {
  return (
    <div className="
      /* Mobile first */
      flex-col
      /* Tablet */
      md:flex-row md:p-4
      /* Desktop */
      lg:flex-row lg:p-6
      /* Large screens */
      xl:max-w-6xl
    ">
      {/* Content */}
    </div>
  );
};
```

### 3. Breakpoint-Specific Classes
Apply responsive classes based on selected breakpoints:

```css
/* Mobile (default) */
.component {
  flex-direction: column;
  padding: 0.5rem;
}

/* Small tablets */
@media (min-width: 640px) {
  .component {
    flex-direction: row;
    padding: 1rem;
  }
}

/* Medium tablets and desktops */
@media (min-width: 768px) {
  .component {
    flex-direction: row;
    padding: 1.5rem;
  }
}

/* Large desktops */
@media (min-width: 1024px) {
  .component {
    max-width: 64rem;
  }
}
```

### 4. Utility Functions
Add responsive utility functions for common patterns:

```typescript
// responsive.ts utility functions
export const getResponsiveClass = (base: string, md?: string, lg?: string, xl?: string) => {
  return `${base} ${md ? md : ''} ${lg ? lg : ''} ${xl ? xl : ''}`.trim();
};

export const isMobile = () => window.innerWidth < 768;
export const isTablet = () => window.innerWidth >= 768 && window.innerWidth < 1024;
export const isDesktop = () => window.innerWidth >= 1024;
```

## Responsive Patterns

### 1. Mobile-First Approach
- Start with mobile styles as default
- Progressively enhance for larger screens
- Use min-width media queries

### 2. Grid Layout Patterns
```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr; /* Single column on mobile */
}

@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr); /* Two columns on tablet */
  }
}

@media (min-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr); /* Three columns on desktop */
  }
}
```

### 3. Flexbox Patterns
```css
.flex-container {
  display: flex;
  flex-direction: column; /* Stack vertically on mobile */
}

@media (min-width: 768px) {
  .flex-container {
    flex-direction: row; /* Horizontal on larger screens */
  }
}
```

## Benefits
- Consistent responsive behavior across components
- Mobile-first design approach
- Scalable breakpoint system
- Progressive enhancement strategy
- Semantic HTML structure
- Accessible responsive design

## Best Practices
- Use mobile-first approach for responsive design
- Maintain consistent spacing and typography
- Test across different device sizes
- Optimize images for different resolutions
- Consider touch targets for mobile devices
- Use relative units (em, rem, %) where appropriate
- Implement graceful degradation for older browsers