export const reactNativeTypeSource = (params: { componentName: string }) => {
    const { componentName } = params;

    return `import { StyleProp, TextProps, TextStyle } from 'react-native';
 import { iconMap } from './${componentName}';

 export type IconType = keyof typeof iconMap;

 export interface ${componentName}Props extends TextProps {
   type: IconType;
   color?: string;
   size?: number;
   style?: StyleProp<Omit<TextStyle, 'fontFamily' | 'fontStyle' | 'fontWeight'>>;
 }
 `;
};
