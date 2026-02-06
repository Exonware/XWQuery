/**
 * XWUIStyle React Wrapper
 */

import React, { useEffect, useRef } from 'react';
import { XWUIStyle, XWUIStyleConfig, XWUIStyleData } from './XWUIStyle';
import { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIStyleProps extends XWUIStyleConfig {
    conf_sys?: XWUISystemConfig;
    conf_usr?: XWUIUserConfig;
    data?: XWUIStyleData;
}

export const XWUIStyleReact: React.FC<XWUIStyleProps> = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const componentRef = useRef<XWUIStyle | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const { conf_sys, conf_usr, data, ...config } = props;
        componentRef.current = new XWUIStyle(
            containerRef.current,
            data || {},
            config,
            conf_sys,
            conf_usr
        );

        return () => {
            if (componentRef.current) {
                componentRef.current.destroy();
            }
        };
    }, []);

    // Update theme when props change
    useEffect(() => {
        if (componentRef.current) {
            const { brand, style, color, accent, lines, roundness, font, icons, emojis } = props;
            componentRef.current.updateTheme({
                brand,
                style,
                color,
                accent,
                lines,
                roundness,
                font,
                icons,
                emojis
            });
        }
    }, [props.brand, props.style, props.color, props.accent, props.lines, props.roundness, props.font, props.icons, props.emojis]);

    return <div ref={containerRef} style={{ display: 'none' }} />;
};

