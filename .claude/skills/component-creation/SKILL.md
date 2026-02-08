# Component Creation Skill

## Purpose
Create reusable React components with proper structure, TypeScript support, and optional testing/stories following best practices.

## When to Use
- Creating new React components with consistent structure
- Setting up component boilerplate with TypeScript types
- Generating components with different patterns (functional, class, HOC, hooks)
- Adding test files and Storybook stories to components
- Maintaining consistent component architecture across projects

## Configuration Options

### 1. Component Type Selection
Choose the appropriate component type for your needs:

```yaml
component_type: functional    # Default - Modern functional components with hooks
component_type: class        # Traditional class components (legacy)
component_type: hoc          # Higher-order components
component_type: hook         # Custom React hooks
```

### 2. Styling Approach
Select styling methodology:

```yaml
styling_type: tailwind       # Tailwind CSS utility classes
styling_type: css_modules   # CSS Modules
styling_type: styled_components # Styled Components
styling_type: none          # No styling (for logic-only components)
```

### 3. Additional Files
Configure optional generated files:

```yaml
with_tests: true            # Generate test files (.test.tsx)
with_stories: false         # Generate Storybook stories (.stories.tsx)
```

## Implementation Steps

### 1. Component Structure
The skill creates a standardized component directory:

```
frontend/src/components/
└── ComponentName/
    ├── ComponentName.tsx      # Main component file
    ├── types.ts              # TypeScript type definitions
    ├── index.ts              # Export file
    ├── ComponentName.test.tsx # Test file (optional)
    └── ComponentName.stories.tsx # Storybook stories (optional)
```

### 2. Component Generation Process
1. Validates component name for proper identifier format
2. Creates component directory structure
3. Generates main component file based on selected type
4. Creates TypeScript type definitions
5. Sets up export index file
6. Conditionally adds test and story files
7. Updates main components index file

### 3. Template Examples

#### Functional Component Template
```tsx
import React from 'react';
import { ComponentNameProps } from './types';
import './ComponentName.css'; // or Tailwind classes

const ComponentName: React.FC<ComponentNameProps> = ({ children, ...props }) => {
  return (
    <div className="component-wrapper">
      {children}
    </div>
  );
};

export default ComponentName;
```

#### Type Definitions Template
```ts
export interface ComponentNameProps {
  children?: React.ReactNode;
  className?: string;
  // Add other props as needed
}

export interface ComponentNameState {
  // Define state interface if needed
}
```

## Benefits
- Consistent component structure across projects
- TypeScript integration by default
- Optional testing and documentation setup
- Modular architecture with proper exports
- Enforced best practices for component creation
- Time-saving automation for repetitive tasks

## Best Practices
- Use descriptive component names
- Follow consistent naming conventions
- Include proper TypeScript interfaces
- Add tests for complex components
- Document components with Storybook stories
- Keep components focused on single responsibilities