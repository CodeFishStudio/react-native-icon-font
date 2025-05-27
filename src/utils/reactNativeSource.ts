export const reactNativeSource = (params: {
    fontName: string;
    componentName: string;
    iconSize: number;
    iconMap: Map<string, string>;
}) => {
    const { fontName, componentName, iconSize, iconMap } = params;

    /**
     * Both the `allowFontScaling` prop and the `includeFontPadding` style are
     * set to `false` to ensure the icon is sized and centered correctly within
     * the bounding box on Android.
     *
     * Setting `width` and `height` style values seems to help centering of
     * icons on iOS.
     */
    return `import { Text } from 'react-native';
import { ${componentName}Props } from './types';

export const iconMap = ${JSON.stringify(Object.fromEntries(iconMap))};

export const ${componentName} = (props: ${componentName}Props) => {
 const {type, color, size = ${iconSize}, style, ...rest} = props;

 const mergedStyle = [
   style,
   {
     fontFamily: '${fontName}',
     fontSize: size,
     width: size,
     height: size,
     color,
     includeFontPadding: false,
   },
 ];

 return (<Text {...rest} allowFontScaling={false} style={mergedStyle}>{iconMap[type]}</Text>);
};
`;
};
