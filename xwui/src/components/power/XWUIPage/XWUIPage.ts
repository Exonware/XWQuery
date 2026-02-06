/**
 * XWUIPage Component
 * Generic page component that composes existing XWUI components to create various page layouts
 * Supports admin panels, list pages, forms, detail pages, search pages, dashboards, settings, wizards, etc.
 * 
 * This component uses ZERO custom rendering logic - it only composes/links existing components.
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIGrid, type XWUIGridConfig, type XWUIGridData } from '../XWUIGrid/XWUIGrid';
import { XWUIAppShell, type XWUIAppShellConfig, type XWUIAppShellData } from '../XWUIAppShell/XWUIAppShell';
import { XWUIContainer, type XWUIContainerConfig, type XWUIContainerData } from '../XWUIContainer/XWUIContainer';

/**
 * Component descriptor for child components within a page
 * Used to declaratively specify which XWUI component to instantiate and where
 */
export interface XWUIPageComponentDescriptor {
    /** Component type/name (e.g., 'XWUITable', 'XWUIForm', 'XWUICard') */
    component: string;
    /** Region where this component should be placed */
    region?: 'header' | 'sidebar' | 'main' | 'footer' | 'aside' | 'breadcrumbs' | 'actions';
    /** Grid area name (if using grid layout) */
    gridArea?: string;
    /** Column/row span for grid items */
    span?: number;
    /** Component-specific configuration (conf_comp) */
    conf_comp?: any;
    /** Component-specific data */
    data?: any;
    /** Optional target/resource ID for routing/data binding (future use) */
    targetId?: string;
}

/**
 * Component-level configuration
 */
export interface XWUIPageConfig {
    /** Page type preset for common layouts */
    pageType?: 'admin' | 'list' | 'form' | 'detail' | 'search' | 'dashboard' | 'settings' | 'wizard' | 'report' | 'custom';
    
    /** Layout configuration */
    layout?: {
        /** Grid-based layout (used when not using AppShell) */
        grid?: {
            columns?: number | string;
            rows?: number | string;
            gap?: string;
            rowGap?: string;
            columnGap?: string;
            areas?: string; // CSS grid-template-areas
            alignItems?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
            justifyItems?: 'start' | 'end' | 'center' | 'stretch';
            alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
            justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
            autoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
            autoRows?: string;
            autoColumns?: string;
            minChildWidth?: string;
            responsive?: {
                sm?: Partial<XWUIGridConfig>;
                md?: Partial<XWUIGridConfig>;
                lg?: Partial<XWUIGridConfig>;
                xl?: Partial<XWUIGridConfig>;
            };
        };
        
        /** Region visibility flags */
        regions?: {
            header?: boolean;
            sidebar?: boolean;
            main?: boolean;
            footer?: boolean;
            aside?: boolean;
            breadcrumbs?: boolean;
            actions?: boolean;
        };
        
        /** Region size overrides */
        sizes?: {
            headerHeight?: string;
            sidebarWidth?: string;
            asideWidth?: string;
            footerHeight?: string;
        };
        
        /** Use AppShell layout instead of Grid */
        useAppShell?: boolean;
        /** AppShell-specific config (if useAppShell is true) */
        appShell?: Partial<XWUIAppShellConfig>;
    };
    
    /** Container wrapper settings */
    container?: {
        maxWidth?: string | number;
        center?: boolean;
        padding?: string | number;
        className?: string;
    };
    
    /** Optional metadata for future extensions (API endpoints, permissions, etc.) */
    meta?: Record<string, any>;
    
    className?: string;
}

/**
 * Page data - content for each region
 */
export interface XWUIPageData {
    /** Page metadata */
    title?: string;
    subtitle?: string;
    description?: string;
    
    /** Region content - can be HTMLElement, string, or component descriptor */
    header?: HTMLElement | string | XWUIPageComponentDescriptor;
    sidebar?: HTMLElement | string | XWUIPageComponentDescriptor;
    main?: HTMLElement | string | XWUIPageComponentDescriptor | XWUIPageComponentDescriptor[];
    footer?: HTMLElement | string | XWUIPageComponentDescriptor;
    aside?: HTMLElement | string | XWUIPageComponentDescriptor;
    breadcrumbs?: HTMLElement | string | XWUIPageComponentDescriptor;
    actions?: HTMLElement | string | XWUIPageComponentDescriptor | XWUIPageComponentDescriptor[];
    
    /** Sections array for complex main content (alternative to main) */
    sections?: Array<{
        title?: string;
        region?: 'header' | 'sidebar' | 'main' | 'footer' | 'aside' | 'breadcrumbs' | 'actions';
        gridArea?: string;
        component: XWUIPageComponentDescriptor;
    }>;
    
    /** Generic content array (alternative to individual regions) */
    content?: Array<{
        region?: 'header' | 'sidebar' | 'main' | 'footer' | 'aside' | 'breadcrumbs' | 'actions';
        gridArea?: string;
        span?: number;
        content: HTMLElement | string | XWUIPageComponentDescriptor;
    }>;
}

export class XWUIPage extends XWUIComponent<XWUIPageData, XWUIPageConfig> {
    private pageElement: HTMLElement | null = null;
    private containerInstance: XWUIContainer | null = null;
    private gridInstance: XWUIGrid | null = null;
    private appShellInstance: XWUIAppShell | null = null;
    private regionElements: Map<string, HTMLElement> = new Map();
    private childComponentInstances: Map<string, XWUIComponent<any, any>> = new Map();

    constructor(
        container: HTMLElement,
        data: XWUIPageData = {},
        conf_comp: XWUIPageConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.setupDOM();
    }

    protected createConfig(
        conf_comp?: XWUIPageConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIPageConfig {
        const pageType = conf_comp?.pageType || 'custom';
        
        // Set defaults based on page type
        const defaults: XWUIPageConfig = {
            pageType,
            layout: {
                regions: {
                    header: pageType === 'admin' || pageType === 'list' || pageType === 'detail' || pageType === 'search',
                    sidebar: pageType === 'admin' || pageType === 'settings' || pageType === 'search',
                    main: true,
                    footer: pageType === 'admin' || pageType === 'list' || pageType === 'form',
                    aside: false,
                    breadcrumbs: pageType === 'detail' || pageType === 'form',
                    actions: pageType === 'form' || pageType === 'list' || pageType === 'detail'
                },
                useAppShell: pageType === 'admin',
                appShell: pageType === 'admin' ? {
                    sidebarCollapsible: true,
                    sidebarWidth: '280px'
                } : undefined
            },
            container: {
                maxWidth: pageType === 'form' || pageType === 'detail' ? '1200px' : undefined,
                center: pageType === 'form' || pageType === 'detail',
                padding: '1rem'
            }
        };

        // Merge with provided config
        return {
            pageType: conf_comp?.pageType ?? defaults.pageType,
            layout: {
                ...defaults.layout,
                ...conf_comp?.layout,
                regions: {
                    ...defaults.layout?.regions,
                    ...conf_comp?.layout?.regions
                },
                grid: {
                    ...conf_comp?.layout?.grid
                },
                sizes: {
                    ...conf_comp?.layout?.sizes
                },
                appShell: {
                    ...defaults.layout?.appShell,
                    ...conf_comp?.layout?.appShell
                }
            },
            container: {
                ...defaults.container,
                ...conf_comp?.container
            },
            meta: conf_comp?.meta,
            className: conf_comp?.className
        };
    }

    private setupDOM(): void {
        // Clear container and set up flex layout
        this.container.innerHTML = '';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.height = '100%';
        this.container.style.width = '100%';
        this.container.style.minHeight = '0';
        this.container.style.overflow = 'hidden';

        // Create page wrapper
        this.pageElement = document.createElement('div');
        this.pageElement.className = 'xwui-page';
        if (this.config.className) {
            this.pageElement.classList.add(this.config.className);
        }
        this.pageElement.style.display = 'flex';
        this.pageElement.style.flexDirection = 'column';
        this.pageElement.style.height = '100%';
        this.pageElement.style.width = '100%';
        this.pageElement.style.minHeight = '0';
        this.pageElement.style.overflow = 'hidden';

        // Apply container wrapper if configured
        let contentContainer: HTMLElement = this.pageElement;
        if (this.config.container) {
            const containerConfig: XWUIContainerConfig = {
                maxWidth: this.config.container.maxWidth,
                center: this.config.container.center,
                padding: this.config.container.padding,
                className: this.config.container.className
            };
            const containerData: XWUIContainerData = {};
            this.containerInstance = new XWUIContainer(
                this.pageElement,
                containerData,
                containerConfig,
                this.conf_sys,
                this.conf_usr
            );
            this.registerChildComponent(this.containerInstance);
            const containerEl = this.containerInstance.getElement();
            if (containerEl) {
                contentContainer = containerEl;
            }
        }

        // Create layout (AppShell or Grid)
        if (this.config.layout?.useAppShell) {
            this.setupAppShellLayout(contentContainer);
        } else {
            this.setupGridLayout(contentContainer);
        }

        // Render regions (content into region elements)
        this.renderRegions();

        this.container.appendChild(this.pageElement);
    }

    private setupAppShellLayout(container: HTMLElement): void {
        // Create region elements first
        const headerEl = this.data.header ? this.createRegionElement('header') : undefined;
        const sidebarEl = this.data.sidebar ? this.createRegionElement('sidebar') : undefined;
        const mainEl = this.createRegionElement('main');
        const footerEl = this.data.footer ? this.createRegionElement('footer') : undefined;
        
        // Render content into region elements before passing to AppShell
        if (headerEl && this.data.header) {
            this.renderRegionContent('header', this.data.header);
        }
        if (sidebarEl && this.data.sidebar) {
            this.renderRegionContent('sidebar', this.data.sidebar);
        }
        if (mainEl && this.data.main) {
            this.renderRegionContent('main', this.data.main);
        }
        if (footerEl && this.data.footer) {
            this.renderRegionContent('footer', this.data.footer);
        }
        
        const appShellData: XWUIAppShellData = {
            header: headerEl,
            sidebar: sidebarEl,
            main: mainEl,
            footer: footerEl
        };

        const appShellConfig: XWUIAppShellConfig = {
            ...this.config.layout?.appShell
        };

        this.appShellInstance = new XWUIAppShell(
            container,
            appShellData,
            appShellConfig,
            this.conf_sys,
            this.conf_usr
        );
        this.registerChildComponent(this.appShellInstance);
    }

    private setupGridLayout(container: HTMLElement): void {
        const gridConfig: XWUIGridConfig = {
            ...this.config.layout?.grid,
            className: 'xwui-page-grid'
        };

        // Set up grid template areas if provided
        if (this.config.layout?.grid?.areas) {
            const style = document.createElement('style');
            style.textContent = `
                .xwui-page-grid {
                    grid-template-areas: ${this.config.layout.grid.areas};
                }
            `;
            document.head.appendChild(style);
        }

        const gridData: XWUIGridData = {
            children: []
        };

        this.gridInstance = new XWUIGrid(
            container,
            gridData,
            gridConfig,
            this.conf_sys,
            this.conf_usr
        );
        this.registerChildComponent(this.gridInstance);

        // Create region elements and add to grid
        const regions = ['header', 'breadcrumbs', 'sidebar', 'main', 'aside', 'actions', 'footer'];
        regions.forEach(region => {
            if (this.shouldRenderRegion(region)) {
                const regionEl = this.createRegionElement(region);
                const gridEl = this.gridInstance?.getElement();
                if (gridEl) {
                    this.gridInstance!.addChild(regionEl);
                }
            }
        });
    }

    private shouldRenderRegion(region: string): boolean {
        const regionKey = region as keyof NonNullable<XWUIPageConfig['layout']>['regions'];
        // Check if region is explicitly enabled, or if data exists for it
        const regionEnabled = this.config.layout?.regions?.[regionKey];
        const hasData = this.hasRegionData(region);
        return regionEnabled ?? hasData;
    }
    
    private hasRegionData(region: string): boolean {
        const regionMap: Record<string, keyof XWUIPageData> = {
            'header': 'header',
            'sidebar': 'sidebar',
            'main': 'main',
            'footer': 'footer',
            'aside': 'aside',
            'breadcrumbs': 'breadcrumbs',
            'actions': 'actions'
        };
        const dataKey = regionMap[region];
        return dataKey ? !!this.data[dataKey] : false;
    }

    private createRegionElement(region: string): HTMLElement {
        const element = document.createElement('div');
        element.className = `xwui-page-region xwui-page-region-${region}`;
        
        // Set grid area if using grid layout
        if (this.config.layout?.grid?.areas) {
            element.style.gridArea = region;
        }

        // Set region-specific sizes
        if (region === 'header' && this.config.layout?.sizes?.headerHeight) {
            element.style.height = this.config.layout.sizes.headerHeight;
        }
        if (region === 'sidebar' && this.config.layout?.sizes?.sidebarWidth) {
            element.style.width = this.config.layout.sizes.sidebarWidth;
        }
        if (region === 'aside' && this.config.layout?.sizes?.asideWidth) {
            element.style.width = this.config.layout.sizes.asideWidth;
        }
        if (region === 'footer' && this.config.layout?.sizes?.footerHeight) {
            element.style.height = this.config.layout.sizes.footerHeight;
        }

        // Set default layout styles for main region when using AppShell
        if (region === 'main' && this.config.layout?.useAppShell) {
            element.style.display = 'flex';
            element.style.flexDirection = 'column';
            element.style.gap = '24px';
            element.style.padding = '96px';
            element.style.maxWidth = '900px';
            element.style.margin = '0 auto';
            element.style.width = '100%';
            element.style.boxSizing = 'border-box';
        }

        this.regionElements.set(region, element);
        return element;
    }

    private renderRegions(): void {
        // Render individual regions (skip if using AppShell as content is already rendered)
        const usingAppShell = this.config.layout?.useAppShell;
        
        if (!usingAppShell) {
            // For Grid layout, render all regions
            if (this.data.header) {
                this.renderRegionContent('header', this.data.header);
            }
            if (this.data.sidebar) {
                this.renderRegionContent('sidebar', this.data.sidebar);
            }
            if (this.data.main) {
                this.renderRegionContent('main', this.data.main);
            }
            if (this.data.footer) {
                this.renderRegionContent('footer', this.data.footer);
            }
        }
        
        // Always render these regions (not handled by AppShell)
        if (this.data.aside) {
            this.renderRegionContent('aside', this.data.aside);
        }
        if (this.data.breadcrumbs) {
            this.renderRegionContent('breadcrumbs', this.data.breadcrumbs);
        }
        if (this.data.actions) {
            this.renderRegionContent('actions', this.data.actions);
        }

        // Render sections if provided
        if (this.data.sections) {
            this.data.sections.forEach(section => {
                const region = section.region || 'main';
                this.renderRegionContent(region, section.component, section.gridArea);
            });
        }

        // Render content array if provided
        if (this.data.content) {
            this.data.content.forEach(item => {
                const region = item.region || 'main';
                this.renderRegionContent(region, item.content, item.gridArea, item.span);
            });
        }
    }

    private renderRegionContent(
        region: string,
        content: HTMLElement | string | XWUIPageComponentDescriptor | XWUIPageComponentDescriptor[],
        gridArea?: string,
        span?: number
    ): void {
        const regionEl = this.regionElements.get(region);
        if (!regionEl) return;

        // Handle array of descriptors
        if (Array.isArray(content)) {
            content.forEach(descriptor => {
                this.renderComponentDescriptor(regionEl, descriptor, gridArea, span).catch(error => {
                    console.error(`Error rendering component ${descriptor.component}:`, error);
                });
            });
            return;
        }

        // Handle single descriptor
        if (typeof content === 'object' && 'component' in content) {
            this.renderComponentDescriptor(regionEl, content, gridArea, span).catch(error => {
                console.error(`Error rendering component ${content.component}:`, error);
            });
            return;
        }

        // Handle HTMLElement or string
        if (typeof content === 'string') {
            regionEl.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            regionEl.appendChild(content);
        }
    }

    private async renderComponentDescriptor(
        container: HTMLElement,
        descriptor: XWUIPageComponentDescriptor,
        gridArea?: string,
        span?: number
    ): Promise<void> {
        // Create container for this component
        const componentContainer = document.createElement('div');
        componentContainer.className = `xwui-page-component xwui-page-component-${descriptor.component.toLowerCase()}`;
        
        if (gridArea || descriptor.gridArea) {
            componentContainer.style.gridArea = gridArea || descriptor.gridArea;
        }
        if (span || descriptor.span) {
            componentContainer.style.gridColumn = `span ${span || descriptor.span}`;
        }

        container.appendChild(componentContainer);

        // Try to instantiate the component dynamically
        try {
            const ComponentClass = await this.loadComponent(descriptor.component);
            if (ComponentClass) {
                const instance = new ComponentClass(
                    componentContainer,
                    descriptor.data || {},
                    descriptor.conf_comp || {},
                    this.conf_sys,
                    this.conf_usr
                );
                this.registerChildComponent(instance);
            } else {
                // Fallback: show component name if not found
                componentContainer.textContent = `[${descriptor.component}]`;
            }
        } catch (error) {
            console.error(`Failed to load component ${descriptor.component}:`, error);
            componentContainer.textContent = `[${descriptor.component} - Error: ${error instanceof Error ? error.message : 'Unknown error'}]`;
        }
    }

    private async loadComponent(componentName: string): Promise<any> {
        // Component name to import path mapping
        const componentMap: Record<string, () => Promise<any>> = {
            'XWUIBreadcrumbs': () => import('../XWUIBreadcrumbs/XWUIBreadcrumbs').then(m => m.XWUIBreadcrumbs),
            'XWUICard': () => import('../XWUICard/XWUICard').then(m => m.XWUICard),
            'XWUITabs': () => import('../XWUITabs/XWUITabs').then(m => m.XWUITabs),
            'XWUIStack': () => import('../XWUIStack/XWUIStack').then(m => m.XWUIStack),
            'XWUIButton': () => import('../XWUIButton/XWUIButton').then(m => m.XWUIButton),
            'XWUIForm': () => import('../XWUIForm/XWUIForm').then(m => m.XWUIForm),
            'XWUITable': () => import('../XWUITable/XWUITable').then(m => m.XWUITable),
            'XWUIInput': () => import('../XWUIInput/XWUIInput').then(m => m.XWUIInput),
            'XWUISelect': () => import('../XWUISelect/XWUISelect').then(m => m.XWUISelect),
            'XWUIPagination': () => import('../XWUIPagination/XWUIPagination').then(m => m.XWUIPagination),
            'XWUISteps': () => import('../XWUISteps/XWUISteps').then(m => m.XWUISteps),
            'XWUIFilters': () => import('../XWUIFilters/XWUIFilters').then(m => m.XWUIFilters),
            'XWUIList': () => import('../XWUIList/XWUIList').then(m => m.XWUIList),
            'XWUIAppBar': () => import('../XWUIAppBar/XWUIAppBar').then(m => m.XWUIAppBar),
            'XWUINavigationRail': () => import('../XWUINavigationRail/XWUINavigationRail').then(m => m.XWUINavigationRail),
            'XWUITypography': () => import('../XWUITypography/XWUITypography').then(m => m.XWUITypography),
            'XWUIStatistic': () => import('../XWUIStatistic/XWUIStatistic').then(m => m.XWUIStatistic),
            'XWUIChart': () => import('../XWUIChart/XWUIChart').then(m => m.XWUIChart),
            'XWUIDateRangePicker': () => import('../XWUIDateRangePicker/XWUIDateRangePicker').then(m => m.XWUIDateRangePicker),
            'XWUISidebar': () => import('../XWUISidebar/XWUISidebar').then(m => m.XWUISidebar),
            'XWUIMenu': () => import('../XWUIMenu/XWUIMenu').then(m => m.XWUIMenu),
            'XWUIAvatar': () => import('../XWUIAvatar/XWUIAvatar').then(m => m.XWUIAvatar),
            'XWUIIcon': () => import('../XWUIIcon/XWUIIcon').then(m => m.XWUIIcon),
            'XWUIBadge': () => import('../XWUIBadge/XWUIBadge').then(m => m.XWUIBadge),
            'XWUISeparator': () => import('../XWUISeparator/XWUISeparator').then(m => m.XWUISeparator),
            'XWUISpace': () => import('../XWUISpace/XWUISpace').then(m => m.XWUISpace),
            'XWUICollapse': () => import('../XWUICollapse/XWUICollapse').then(m => m.XWUICollapse),
            'XWUIAccordion': () => import('../XWUIAccordion/XWUIAccordion').then(m => m.XWUIAccordion),
        };

        const loader = componentMap[componentName];
        if (loader) {
            return await loader();
        }

        // Try dynamic import with standard naming convention
        try {
            const componentPath = `../${componentName}/${componentName}`;
            const module = await import(componentPath);
            return module[componentName];
        } catch (error) {
            console.warn(`Component ${componentName} not found in standard location`);
            return null;
        }
    }

    public getRegionElement(region: string): HTMLElement | undefined {
        return this.regionElements.get(region);
    }

    public getPageElement(): HTMLElement | null {
        return this.pageElement;
    }

    public destroy(): void {
        // Clear region elements
        this.regionElements.clear();
        
        // Clear child component instances
        this.childComponentInstances.clear();
        
        // Clear references
        this.pageElement = null;
        this.containerInstance = null;
        this.gridInstance = null;
        this.appShellInstance = null;
        
        // Call parent to destroy registered child components
        super.destroy();
    }
}

(XWUIPage as any).componentName = 'XWUIPage';

