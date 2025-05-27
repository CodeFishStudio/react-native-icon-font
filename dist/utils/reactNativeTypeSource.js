"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactNativeTypeSource = void 0;
const reactNativeTypeSource = (params) => {
    const { componentName } = params;
    return `import { StyleProp, TextProps, TextStyle } from 'react-native';
 import { iconMap } from './IconText';

 export type IconType = keyof typeof iconMap;

 export interface ${componentName}Props extends TextProps {
   type: IconType;
   color?: string;
   size?: number;
   style?: StyleProp<Omit<TextStyle, 'fontFamily' | 'fontStyle' | 'fontWeight'>>;
 }
 `;
};
exports.reactNativeTypeSource = reactNativeTypeSource;
//# sourceMappingURL=reactNativeTypeSource.js.map