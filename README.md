# React Native Icon Font

Generate an icon font from SVG icons for React Native projects. This package converts SVG files into a TTF font and generates a TypeScript React Native component for easy use.

## Installation

```bash
bun add --dev github:codefishstudio/react-native-icon-font
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
bun add --dev svg2ttf svgicons2svgfont fix-path-directions @types/svg2ttf
```

## Quick Start

```typescript
import { compileIconFont } from 'react-native-icon-font';

await compileIconFont({
    svgSource: 'assets/icons',
    fontOutput: 'assets/fonts',
    fontName: 'Icons',
    componentOutput: 'src/components/Icon',
    componentName: 'Icon',
    iconSize: 24,
});
```

## API Reference

### `compileIconFont(options)`

Generates a TTF font file and React Native component from SVG files.

#### Options

| Option            | Type     | Description                                                                                                    |
| ----------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `svgSource`       | `string` | Directory path containing SVG files. Ensure all SVGs have the same dimensions.                                 |
| `fontOutput`      | `string` | Output directory for the generated TTF font file.                                                              |
| `fontName`        | `string` | Name of the generated font (e.g., `'Icons'`). This will be the name used for a `fontFamily` style declaration. |
| `componentOutput` | `string` | Output directory for the generated React Native component.                                                     |
| `componentName`   | `string` | Name of the generated React Native component (e.g., `'Icon'`).                                                 |
| `iconSize`        | `number` | The size of the icon in pixels.                                                                                |

#### Returns

`Promise<void>` - Resolves when font and component generation is complete.

## Usage Examples

### Using the Generated Component

After running `compileIconFont`, you'll get a React Native component that you can use like this:

```typescript
import { Icon } from './src/components/Icon';

function MyApp() {
  return (
    <>
      <Icon type="home" size={24} color="#000000" />
      <Icon type="user" size={32} color="#007AFF" />
      <Icon type="settings" color="#FF0000" /> {/* Uses default iconSize */}
    </>
  );
}
```

## File Structure

### Input Structure

Your SVG files should be organized like this:

```
icons/
├── home.svg
├── user.svg
├── settings.svg
└── search.svg
```

The filename (without `.svg`) becomes the icon `type` prop value.

### Output Structure

After running `compileIconFont`, you'll get:

```
assets/fonts/
└── Icons.ttf            # The generated font file

src/components/Icon/
├── Icon.tsx             # The React Native component
└── types.ts             # TypeScript types for the component
```

## Generated Component API

The generated component accepts the following props:

```typescript
interface IconProps extends TextProps {
    type: IconType; // Icon name (derived from SVG filename)
    color?: string; // Icon color (default: inherits Text color)
    size?: number; // Icon size in pixels (default: iconSize from options)
    style?: StyleProp<TextStyle>;
}
```

## SVG Requirements

- SVG files should be valid and well-formed
- Icons work best when they are square (same width and height)
- Use solid fills rather than strokes when possible
- The SVG filename (without extension) becomes the icon `type` prop value
