/**
 * XWUISlider Component - Production Quality
 * High-performance slider with MUI-like features and 100% styles system integration
 * Features: Performance optimized, value labels, icons, thumb customization, range slider,
 * linked sliders, steppers, non-linear scale, track options, smooth animations
 */

import { XWUIComponent } from '../XWUIComponent/XWUIComponent';

// Type definitions
export type SliderOrientation = 'horizontal' | 'vertical';
export type SliderColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type SliderSize = 'small' | 'medium' | 'large';
export type ValueLabelDisplay = 'off' | 'auto' | 'on';
export type TrackDisplay = 'normal' | 'inverted' | false;
export type SliderDirection = 'ltr' | 'rtl' | 'ttd' | 'dtt'; // left-to-right, right-to-left, top-to-down, down-to-top

export interface SliderMark {
    value: number;
    label?: string;
}

export interface LinkedSlider {
    slider: XWUISlider;
    ratio?: number; // Ratio to apply (default: 1)
    invert?: boolean; // Invert the relationship
}

export type ThumbContent = 
    | string // Emoji or HTML string
    | HTMLElement // Custom element
    | { 
        emoji?: string; 
        shape?: 'circle' | 'square' | 'diamond' | 'star'; 
        image?: string; // Image URL
        svg?: string; // SVG content
      };

// Component-level configuration
export interface XWUISliderConfig {
    // Basic options
    min?: number;
    max?: number;
    step?: number | null; // null = restricted to marks only
    disabled?: boolean;
    
    // Display options
    orientation?: SliderOrientation;
    color?: SliderColor;
    size?: SliderSize;
    valueLabelDisplay?: ValueLabelDisplay; // off | auto | on
    valueLabelFormat?: (value: number) => string;
    
    // Marks
    marks?: boolean | SliderMark[];
    markLabelDisplay?: 'on' | 'off';
    
    // Track options
    track?: TrackDisplay; // normal | inverted | false
    
    // Icons
    startIcon?: string | HTMLElement;
    endIcon?: string | HTMLElement;
    
    // Title/Direction label
    showTitle?: boolean; // Show direction title (up/down/left/right)
    title?: string; // Custom title text (overrides auto-generated direction title)
    direction?: SliderDirection; // Direction for title (ltr/rtl/ttd/dtt)
    
    // Thumb customization (emojis/shapes/images)
    thumbContent?: ThumbContent | ThumbContent[]; // Single or array for range slider
    
    // Range slider options
    minDistance?: number; // Minimum distance between thumbs
    disableSwap?: boolean; // Disable thumb swapping on hover
    
    // Scale
    scale?: (value: number) => number; // Non-linear scale transformation
    
    // Animation
    animateOnSet?: boolean; // Animate when value set programmatically
    animationDuration?: number; // Animation duration in ms
    
    // Linked sliders
    linkedSliders?: LinkedSlider[];
    
    // Steppers
    showSteppers?: boolean; // Show increment/decrement buttons
    
    // Misc
    shiftStep?: number; // Step size when Shift+Arrow is pressed
    className?: string;
}

// Data type
export interface XWUISliderData {
    value?: number | [number, number]; // Single value or range
    label?: string;
    ariaLabel?: string | ((index?: number) => string);
    ariaValueText?: string | ((value: number, index?: number) => string);
    name?: string;
    id?: string;
}

export class XWUISlider extends XWUIComponent<XWUISliderData, XWUISliderConfig> {
    private wrapperElement: HTMLElement | null = null;
    private labelElement: HTMLElement | null = null;
    private titleElement: HTMLElement | null = null;
    private sliderContainer: HTMLElement | null = null;
    private trackElement: HTMLElement | null = null;
    private railElement: HTMLElement | null = null;
    private fillElement: HTMLElement | null = null;
    private thumbElements: HTMLElement[] = [];
    private hiddenInputElements: HTMLInputElement[] = []; // Hidden native inputs for accessibility
    private tooltipElements: HTMLElement[] = [];
    private tooltipLabelElements: HTMLElement[] = []; // Inner label elements in nested structure
    private marksContainer: HTMLElement | null = null;
    private startIconElement: HTMLElement | null = null;
    private endIconElement: HTMLElement | null = null;
    private stepperContainer: HTMLElement | null = null;
    
    private isDragging: boolean = false;
    private activeThumbIndex: number = 0;
    private hoveredThumbIndex: number = -1;
    private animationFrameId: number | null = null;
    private isAnimating: boolean = false;
    private lastUpdateTime: number = 0;
    private pendingUpdate: boolean = false;
    
    private changeHandlers: Array<(value: number | [number, number], event: Event) => void> = [];
    
    // Bound event handlers for proper cleanup
    private boundMouseMove: (e: MouseEvent) => void;
    private boundMouseUp: () => void;
    private boundTouchMove: (e: TouchEvent) => void;
    private boundTouchEnd: () => void;
    private boundPointerMove: (e: PointerEvent) => void;
    private boundPointerUp: (e: PointerEvent) => void;

    constructor(
        container: HTMLElement,
        data: XWUISliderData = {},
        conf_comp: XWUISliderConfig = {}
    ) {
        super(container, data, conf_comp);
        
        // Bind event handlers for proper cleanup
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseUp = this.handleMouseUp.bind(this);
        this.boundTouchMove = this.handleTouchMove.bind(this);
        this.boundTouchEnd = this.handleTouchEnd.bind(this);
        this.boundPointerMove = this.handlePointerMove.bind(this);
        this.boundPointerUp = this.handlePointerUp.bind(this);
        
        // Initialize default value
        if (this.data.value === undefined) {
            const isRange = Array.isArray(this.data.value) || this.config.minDistance !== undefined;
            this.data.value = isRange 
                ? [this.config.min ?? 0, this.config.max ?? 100]
                : (this.config.min ?? 0);
        }
        
        this.setupDOM();
    }

    private generateDirectionTitle(): string {
        const orientation = this.config.orientation ?? 'horizontal';
        const direction = this.config.direction;
        
        if (orientation === 'vertical') {
            if (direction === 'dtt') {
                return 'Down';
            } else {
                return 'Up';
            }
        } else {
            if (direction === 'rtl') {
                return 'Right';
            } else {
                return 'Left';
            }
        }
    }

    protected createConfig(conf_comp?: XWUISliderConfig): XWUISliderConfig {
        return {
            min: conf_comp?.min ?? 0,
            max: conf_comp?.max ?? 100,
            step: conf_comp?.step ?? 1,
            disabled: conf_comp?.disabled ?? false,
            orientation: conf_comp?.orientation ?? 'horizontal',
            color: conf_comp?.color ?? 'primary',
            size: conf_comp?.size ?? 'medium',
            valueLabelDisplay: conf_comp?.valueLabelDisplay ?? 'auto',
            marks: conf_comp?.marks ?? false,
            track: conf_comp?.track ?? 'normal',
            minDistance: conf_comp?.minDistance,
            disableSwap: conf_comp?.disableSwap ?? false,
            animateOnSet: conf_comp?.animateOnSet ?? true,
            animationDuration: conf_comp?.animationDuration ?? 300,
            shiftStep: conf_comp?.shiftStep ?? conf_comp?.step ?? 10,
            showSteppers: conf_comp?.showSteppers ?? false,
            scale: conf_comp?.scale,
            linkedSliders: conf_comp?.linkedSliders,
            startIcon: conf_comp?.startIcon,
            endIcon: conf_comp?.endIcon,
            thumbContent: conf_comp?.thumbContent,
            valueLabelFormat: conf_comp?.valueLabelFormat,
            markLabelDisplay: conf_comp?.markLabelDisplay ?? 'on',
            showTitle: conf_comp?.showTitle ?? false,
            title: conf_comp?.title,
            direction: conf_comp?.direction,
            className: conf_comp?.className
        };
    }

    private setupDOM(): void {
        this.container.innerHTML = '';

        // Create wrapper
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-slider';
        this.wrapperElement.classList.add(`xwui-slider--${this.config.size}`);
        this.wrapperElement.classList.add(`xwui-slider--${this.config.color}`);
        this.wrapperElement.classList.add(`xwui-slider--${this.config.orientation}`);
        
        if (this.config.disabled) {
            this.wrapperElement.classList.add('xwui-slider--disabled');
        }
        if (this.config.track === 'inverted') {
            this.wrapperElement.classList.add('xwui-slider--track-inverted');
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Label
        if (this.data.label) {
            this.labelElement = document.createElement('label');
            this.labelElement.className = 'xwui-slider__label';
            this.labelElement.textContent = this.data.label;
            this.wrapperElement.appendChild(this.labelElement);
        }

        // Title/Direction label
        if (this.config.showTitle) {
            this.titleElement = document.createElement('div');
            this.titleElement.className = 'xwui-slider__title';
            const titleText = this.config.title || this.generateDirectionTitle();
            this.titleElement.textContent = titleText;
            this.wrapperElement.appendChild(this.titleElement);
        }

        // Main slider container
        this.sliderContainer = document.createElement('div');
        this.sliderContainer.className = 'xwui-slider__container';
        
        // Icons container (if icons are provided)
        if (this.config.startIcon || this.config.endIcon) {
            const iconsContainer = document.createElement('div');
            iconsContainer.className = 'xwui-slider__icons';
            
            if (this.config.startIcon) {
                this.startIconElement = this.createIconElement(this.config.startIcon);
                iconsContainer.appendChild(this.startIconElement);
            }
            
            const trackWrapper = document.createElement('div');
            trackWrapper.className = 'xwui-slider__track-wrapper';
            this.createSliderTrack(trackWrapper);
            iconsContainer.appendChild(trackWrapper);
            
            if (this.config.endIcon) {
                this.endIconElement = this.createIconElement(this.config.endIcon);
                iconsContainer.appendChild(this.endIconElement);
            }
            
            this.sliderContainer.appendChild(iconsContainer);
        } else {
            this.createSliderTrack(this.sliderContainer);
        }
        
        // Steppers
        if (this.config.showSteppers) {
            this.createSteppers();
        }
        
        // Marks
        if (this.config.marks) {
            this.createMarks();
        }
        
        this.wrapperElement.appendChild(this.sliderContainer);
        this.container.appendChild(this.wrapperElement);
        
        // Initial update (skip animation on init)
        this.updatePositions(false);
        
        // Setup global event listeners
        this.setupEventListeners();
    }
    
    private createSliderTrack(container: HTMLElement): void {
        // Rail (inactive track)
        this.railElement = document.createElement('div');
        this.railElement.className = 'xwui-slider__rail';
        
        // Track (active container)
        this.trackElement = document.createElement('div');
        this.trackElement.className = 'xwui-slider__track';
        
        if (this.config.track === false) {
            this.trackElement.style.display = 'none';
        }

        // Fill (active portion)
        this.fillElement = document.createElement('div');
        this.fillElement.className = 'xwui-slider__fill';
        this.trackElement.appendChild(this.fillElement);

        // Thumbs
        const isRange = Array.isArray(this.data.value);
        const thumbCount = isRange ? 2 : 1;
        
        this.thumbElements = [];
        this.hiddenInputElements = [];
        this.tooltipElements = [];
        this.tooltipLabelElements = [];
        
        // Get thumb content (single or array)
        const thumbContents = Array.isArray(this.config.thumbContent) 
            ? this.config.thumbContent 
            : this.config.thumbContent 
                ? [this.config.thumbContent] 
                : [];

        for (let i = 0; i < thumbCount; i++) {
            const thumb = document.createElement('div');
            thumb.className = 'xwui-slider__thumb';
            thumb.setAttribute('role', 'slider');
            thumb.setAttribute('tabindex', this.config.disabled ? '-1' : '0');
            thumb.setAttribute('aria-valuemin', String(this.config.min));
            thumb.setAttribute('aria-valuemax', String(this.config.max));
            thumb.setAttribute('aria-orientation', this.config.orientation ?? 'horizontal');
            
            // Hidden native input element for accessibility (MUI pattern)
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'range';
            hiddenInput.setAttribute('data-index', String(i));
            hiddenInput.setAttribute('aria-label', this.data.ariaLabel ? 
                (typeof this.data.ariaLabel === 'function' ? this.data.ariaLabel(i) : this.data.ariaLabel) : 
                (this.data.label || 'Slider'));
            hiddenInput.setAttribute('aria-orientation', this.config.orientation ?? 'horizontal');
            hiddenInput.min = String(this.config.min ?? 0);
            hiddenInput.max = String(this.config.max ?? 100);
            hiddenInput.step = this.config.step === null ? 'any' : String(this.config.step ?? 1);
            hiddenInput.style.cssText = 'border:0;clip:rect(0 0 0 0);height:100%;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:100%;direction:ltr';
            hiddenInput.setAttribute('tabindex', '-1');
            hiddenInput.setAttribute('aria-hidden', 'true');
            
            // Update input value and aria attributes
            this.updateHiddenInputAttributes(hiddenInput, i);
            
            // Prevent native input from interfering with our custom handler
            hiddenInput.addEventListener('input', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            hiddenInput.addEventListener('change', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            
            this.hiddenInputElements.push(hiddenInput);
            thumb.appendChild(hiddenInput);
            
            // Update aria attributes
            this.updateThumbAriaAttributes(thumb, i);
            
            // Apply thumb customization (emoji/shape/image)
            if (thumbContents[i]) {
                this.applyThumbContent(thumb, thumbContents[i]);
            }
            
            // Value tooltip with nested structure (MUI pattern)
            if (this.config.valueLabelDisplay !== 'off') {
                const tooltip = document.createElement('div');
                tooltip.className = 'xwui-slider__tooltip';
                tooltip.setAttribute('role', 'tooltip');
                tooltip.setAttribute('aria-hidden', 'true');
                
                // Nested structure: tooltip > circle > label
                const circle = document.createElement('span');
                circle.className = 'xwui-slider__tooltip-circle';
                
                const label = document.createElement('span');
                label.className = 'xwui-slider__tooltip-label';
                
                circle.appendChild(label);
                tooltip.appendChild(circle);
                
                this.tooltipElements.push(tooltip);
                this.tooltipLabelElements.push(label);
                thumb.appendChild(tooltip);
            }

            // Pointer events for unified mouse/touch handling (modern approach)
            thumb.addEventListener('pointerdown', (e) => {
                if (!this.config.disabled) {
                    e.preventDefault();
                    (e as any).__handledByPointer = true; // Mark as handled
                    if (thumb.setPointerCapture) {
                        thumb.setPointerCapture(e.pointerId);
                    }
                    this.startDrag(i, e);
                }
            }, { passive: false });

            // Mouse events (fallback for older browsers - pointer events take priority)
            thumb.addEventListener('mousedown', (e) => {
                if (!this.config.disabled) {
                    // Only handle if not already handled by pointer events
                    const wasHandled = (e as any).__handledByPointer;
                    if (!wasHandled) {
                        this.startDrag(i, e);
                    }
                }
            }, { passive: true });
            
            thumb.addEventListener('touchstart', (e) => {
                if (!this.config.disabled) {
                    // Only handle if not already handled by pointer events
                    const wasHandled = (e as any).__handledByPointer;
                    if (!wasHandled) {
                        e.preventDefault();
                        this.startDrag(i, e.touches[0] as any);
                    }
                }
            }, { passive: false });

            // Keyboard events
            thumb.addEventListener('keydown', (e) => {
                if (!this.config.disabled) {
                    this.handleKeydown(i, e);
                }
            });
            
            // Mouse wheel events for scrolling when focused
            thumb.addEventListener('wheel', (e) => {
                if (!this.config.disabled && document.activeElement === thumb) {
                    e.preventDefault();
                    const delta = e.deltaY > 0 ? -1 : 1;
                    const step = this.config.step ?? 1;
                    const currentValue = Array.isArray(this.data.value) 
                        ? (this.data.value as [number, number])[i]
                        : (this.data.value as number);
                    const newValue = Math.max(
                        this.config.min ?? 0,
                        Math.min(this.config.max ?? 100, currentValue + (step * delta))
                    );
                    this.updateValue(newValue, i, e, false);
                }
            }, { passive: false });
            
            // Hover events
            thumb.addEventListener('mouseenter', () => {
                if (!this.isDragging) {
                    this.hoveredThumbIndex = i;
                    this.updateHoverState();
                }
            });
            
            thumb.addEventListener('mouseleave', () => {
                if (!this.isDragging) {
                    this.hoveredThumbIndex = -1;
                    this.updateHoverState();
                }
            });
            
            this.thumbElements.push(thumb);
            this.trackElement.appendChild(thumb);
        }

        // Track click/pointer
        this.trackElement.addEventListener('pointerdown', (e) => {
            if (!this.config.disabled && !this.isDragging && e.button === 0) {
                e.preventDefault();
                this.handleTrackClick(e);
            }
        });
        
        this.trackElement.addEventListener('click', (e) => {
            if (!this.config.disabled && !this.isDragging) {
                this.handleTrackClick(e);
            }
        });
        
        this.railElement.appendChild(this.trackElement);
        container.appendChild(this.railElement);
    }
    
    private createIconElement(icon: string | HTMLElement): HTMLElement {
        const iconElement = document.createElement('span');
        iconElement.className = 'xwui-slider__icon';
        
        if (typeof icon === 'string') {
            iconElement.innerHTML = icon;
        } else {
            iconElement.appendChild(icon.cloneNode(true));
        }
        
        return iconElement;
    }
    
    private applyThumbContent(thumb: HTMLElement, content: ThumbContent): void {
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'xwui-slider__thumb-content';
        
        if (typeof content === 'string') {
            // String (emoji or HTML)
            contentWrapper.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            // HTMLElement
            contentWrapper.appendChild(content.cloneNode(true));
        } else if (typeof content === 'object') {
            // Object with emoji, shape, image, or svg
            if (content.emoji) {
                contentWrapper.textContent = content.emoji;
            } else if (content.image) {
                const img = document.createElement('img');
                img.src = content.image;
                img.alt = '';
                contentWrapper.appendChild(img);
            } else if (content.svg) {
                contentWrapper.innerHTML = content.svg;
            } else if (content.shape) {
                contentWrapper.className += ` xwui-slider__thumb-content--shape-${content.shape}`;
            }
        }
        
        thumb.appendChild(contentWrapper);
    }
    
    private createSteppers(): void {
        this.stepperContainer = document.createElement('div');
        this.stepperContainer.className = 'xwui-slider__steppers';
        
        const decreaseBtn = document.createElement('button');
        decreaseBtn.className = 'xwui-slider__stepper xwui-slider__stepper--decrease';
        decreaseBtn.setAttribute('aria-label', 'Decrease value');
        decreaseBtn.setAttribute('type', 'button');
        decreaseBtn.innerHTML = '−';
        decreaseBtn.addEventListener('click', () => {
            if (!this.config.disabled) {
                this.stepValue(-1);
            }
        });
        
        const increaseBtn = document.createElement('button');
        increaseBtn.className = 'xwui-slider__stepper xwui-slider__stepper--increase';
        increaseBtn.setAttribute('aria-label', 'Increase value');
        increaseBtn.setAttribute('type', 'button');
        increaseBtn.innerHTML = '+';
        increaseBtn.addEventListener('click', () => {
            if (!this.config.disabled) {
                this.stepValue(1);
            }
        });
        
        // For vertical sliders, reverse the visual order (increase on top, decrease on bottom)
        // For horizontal, decrease on left, increase on right
        if (this.config.orientation === 'vertical') {
            this.stepperContainer.appendChild(increaseBtn);
            this.stepperContainer.appendChild(decreaseBtn);
        } else {
            this.stepperContainer.appendChild(decreaseBtn);
            this.stepperContainer.appendChild(increaseBtn);
        }
        
        this.sliderContainer!.appendChild(this.stepperContainer);
    }
    
    private createMarks(): void {
        this.marksContainer = document.createElement('div');
        this.marksContainer.className = 'xwui-slider__marks';
        
        let marks: SliderMark[];
        
        if (Array.isArray(this.config.marks)) {
            marks = this.config.marks;
        } else if (this.config.marks === true) {
            // Auto-generate marks from step
            marks = [];
            if (this.config.step && this.config.step > 0) {
                const step = this.config.step;
                const min = this.config.min ?? 0;
                const max = this.config.max ?? 100;
                
                for (let val = min; val <= max; val += step) {
                    marks.push({ value: val });
                }
            }
        } else {
            marks = [];
        }
        
        marks.forEach((mark, index) => {
            const markElement = document.createElement('div');
            markElement.className = 'xwui-slider__mark';
            markElement.setAttribute('data-index', String(index));
            const percent = this.valueToPercent(mark.value);
            
            if (this.config.orientation === 'vertical') {
                markElement.style.bottom = `${percent}%`;
            } else {
                markElement.style.left = `${percent}%`;
            }
            
            // Check if mark is active (within current value range)
            const isActive = this.isMarkActive(mark.value);
            if (isActive) {
                markElement.classList.add('xwui-slider__mark--active');
            }
            
            const dot = document.createElement('span');
            dot.className = 'xwui-slider__mark-dot';
            markElement.appendChild(dot);
            
            if (mark.label && this.config.markLabelDisplay === 'on') {
                const label = document.createElement('span');
                label.className = 'xwui-slider__mark-label';
                label.setAttribute('aria-hidden', 'true');
                if (isActive) {
                    label.classList.add('xwui-slider__mark-label--active');
                }
                label.textContent = mark.label;
                markElement.appendChild(label);
            }
            
            this.marksContainer!.appendChild(markElement);
        });
        
        this.sliderContainer!.appendChild(this.marksContainer);
    }
    
    private isMarkActive(markValue: number): boolean {
        if (Array.isArray(this.data.value)) {
            const [minVal, maxVal] = this.data.value as [number, number];
            return markValue >= minVal && markValue <= maxVal;
        } else {
            const currentValue = this.data.value as number;
            // Mark is active if it's less than or equal to current value
            return markValue <= currentValue;
        }
    }
    
    private updateMarkStates(): void {
        if (!this.marksContainer) return;
        
        // Get all marks from config
        let marks: SliderMark[] = [];
        if (Array.isArray(this.config.marks)) {
            marks = this.config.marks;
        } else if (this.config.marks === true && this.config.step && this.config.step > 0) {
            const step = this.config.step;
            const min = this.config.min ?? 0;
            const max = this.config.max ?? 100;
            for (let val = min; val <= max; val += step) {
                marks.push({ value: val });
            }
        }
        
        const markElements = this.marksContainer.querySelectorAll('.xwui-slider__mark');
        markElements.forEach((markElement, index) => {
            if (index >= marks.length) return;
            
            const markValue = marks[index].value;
            const isActive = this.isMarkActive(markValue);
            
            if (isActive) {
                markElement.classList.add('xwui-slider__mark--active');
                const label = markElement.querySelector('.xwui-slider__mark-label');
                if (label) {
                    label.classList.add('xwui-slider__mark-label--active');
                }
            } else {
                markElement.classList.remove('xwui-slider__mark--active');
                const label = markElement.querySelector('.xwui-slider__mark-label');
                if (label) {
                    label.classList.remove('xwui-slider__mark-label--active');
                }
            }
        });
    }
    
    private setupEventListeners(): void {
        // Global event listeners for dragging - pointer events first (modern)
        document.addEventListener('pointermove', this.boundPointerMove);
        document.addEventListener('pointerup', this.boundPointerUp);
        // Fallback for older browsers
        document.addEventListener('mousemove', this.boundMouseMove);
        document.addEventListener('mouseup', this.boundMouseUp);
        document.addEventListener('touchmove', this.boundTouchMove, { passive: false });
        document.addEventListener('touchend', this.boundTouchEnd);
    }
    
    private updateHiddenInputAttributes(input: HTMLInputElement, index: number): void {
        const isRange = Array.isArray(this.data.value);
        const currentValue = isRange 
            ? (this.data.value as [number, number])[index]
            : (this.data.value as number);
        
        input.value = String(currentValue);
        input.setAttribute('aria-valuenow', String(currentValue));
        
        // Update aria-valuetext if provided
        if (this.data.ariaValueText) {
            const valueText = typeof this.data.ariaValueText === 'function'
                ? this.data.ariaValueText(currentValue, index)
                : this.data.ariaValueText;
            input.setAttribute('aria-valuetext', valueText);
        } else if (this.config.valueLabelFormat) {
            // Use value label format for aria-valuetext
            input.setAttribute('aria-valuetext', this.config.valueLabelFormat(currentValue));
        }
    }
    
    private updateThumbAriaAttributes(thumb: HTMLElement, index: number): void {
        const isRange = Array.isArray(this.data.value);
        const currentValue = isRange 
            ? (this.data.value as [number, number])[index]
            : (this.data.value as number);
        
        // Aria label
        if (this.data.ariaLabel) {
            const label = typeof this.data.ariaLabel === 'function' 
                ? this.data.ariaLabel(index) 
                : this.data.ariaLabel;
            thumb.setAttribute('aria-label', label);
        } else if (this.data.label) {
            thumb.setAttribute('aria-label', `${this.data.label} ${isRange ? (index === 0 ? 'minimum' : 'maximum') : ''}`);
        }
        
        // Aria value text - always set for better accessibility
        let valueText: string;
        if (this.data.ariaValueText) {
            valueText = typeof this.data.ariaValueText === 'function'
                ? this.data.ariaValueText(currentValue, index)
                : this.data.ariaValueText;
        } else if (this.config.valueLabelFormat) {
            // Use value label format for aria-valuetext
            valueText = this.config.valueLabelFormat(currentValue);
        } else {
            // Default to string representation
            valueText = String(currentValue);
        }
        thumb.setAttribute('aria-valuetext', valueText);
        
        thumb.setAttribute('aria-valuenow', String(currentValue));
    }
    
    private updateHoverState(): void {
        this.thumbElements.forEach((thumb, index) => {
            if (index === this.hoveredThumbIndex) {
                thumb.classList.add('xwui-slider__thumb--hovered');
            } else {
                thumb.classList.remove('xwui-slider__thumb--hovered');
            }
        });
    }

    private valueToPercent(value: number): number {
        let { min = 0, max = 100 } = this.config;
        
        // Apply scale if provided (for non-linear scaling)
        if (this.config.scale) {
            // Scale is applied to the value for display
            // For percent calculation, we need the raw value
            // This is a simplified version - scale should transform the actual value
            return ((value - min) / (max - min)) * 100;
        }
        
        return ((value - min) / (max - min)) * 100;
    }

    private percentToValue(percent: number): number {
        let { min = 0, max = 100, step = 1 } = this.config;
        // No need to invert here - percent is already calculated correctly in updateFromPointer
        
        let value = (percent / 100) * (max - min) + min;
        
        // If step is null, restrict to marks only
        if (step === null) {
            value = this.snapToNearestMark(value);
        } else if (step > 0) {
            // Apply step rounding
            value = Math.round(value / step) * step;
            // Ensure precision doesn't cause floating point issues
            value = Math.round(value * 1000) / 1000;
        }
        
        // Apply scale inverse if provided
        if (this.config.scale) {
            // For non-linear scale, we need to find the inverse
            // This is simplified - in practice you'd need a proper inverse function
            // For now, we'll use the scale function on a reverse lookup
            // This would need proper implementation based on scale function
        }
        
        // Clamp to min/max
        return Math.max(min, Math.min(max, value));
    }
    
    private snapToNearestMark(value: number): number {
        if (!this.config.marks || this.config.marks === true) {
            // Auto-generated marks - use step if available
            const step = this.config.step ?? 1;
            if (step > 0) {
                return Math.round(value / step) * step;
            }
            return value;
        }
        
        // Custom marks - find nearest mark value
        const marks = this.config.marks as SliderMark[];
        if (marks.length === 0) return value;
        
        let nearestMark = marks[0];
        let minDistance = Math.abs(value - nearestMark.value);
        
        for (const mark of marks) {
            const distance = Math.abs(value - mark.value);
            if (distance < minDistance) {
                minDistance = distance;
                nearestMark = mark;
            }
        }
        
        return nearestMark.value;
    }
    
    private stepValue(direction: number): void {
        const isRange = Array.isArray(this.data.value);
        const step = this.config.step ?? 1;
        
        if (isRange) {
            const [minVal, maxVal] = this.data.value as [number, number];
            // Step the closest thumb to center
            const mid = (minVal + maxVal) / 2;
            const currentValue = Math.abs(mid - minVal) < Math.abs(mid - maxVal) ? minVal : maxVal;
            const thumbIndex = currentValue === minVal ? 0 : 1;
            const newValue = Math.max(
                this.config.min ?? 0,
                Math.min(this.config.max ?? 100, currentValue + (step * direction))
            );
            this.updateValue(newValue, thumbIndex, new Event('click'));
        } else {
            const currentValue = this.data.value as number;
            const newValue = Math.max(
                this.config.min ?? 0,
                Math.min(this.config.max ?? 100, currentValue + (step * direction))
            );
            this.updateValue(newValue, 0, new Event('click'));
        }
    }

    private updatePositions(animated: boolean = false): void {
        // Use requestAnimationFrame for smooth updates
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        this.animationFrameId = requestAnimationFrame(() => {
            this.performPositionUpdate(animated);
            this.animationFrameId = null;
        });
    }
    
    private performPositionUpdate(animated: boolean = false): void {
        if (!this.trackElement || !this.fillElement || this.thumbElements.length === 0) return;
        
        const isRange = Array.isArray(this.data.value);
        const isVertical = this.config.orientation === 'vertical';
        const transitionEnabled = animated && this.config.animateOnSet && !this.isDragging;
        
        // Disable transitions during dragging for smooth performance
        if (this.isDragging) {
            this.fillElement.style.transition = 'none';
            this.thumbElements.forEach(thumb => {
                thumb.style.transition = 'none';
            });
        } else if (transitionEnabled) {
            const duration = this.config.animationDuration ?? 300;
            this.fillElement.style.transition = `all ${duration}ms ease`;
            this.thumbElements.forEach(thumb => {
                thumb.style.transition = `all ${duration}ms ease`;
            });
        }
        
        if (isRange) {
            const [minVal, maxVal] = this.data.value as [number, number];
            const minPercent = this.valueToPercent(minVal);
            const maxPercent = this.valueToPercent(maxVal);
            
            // Update fill position and size
            if (isVertical) {
                this.fillElement.style.bottom = `${minPercent}%`;
                this.fillElement.style.height = `${maxPercent - minPercent}%`;
                this.fillElement.style.top = 'auto';
                this.fillElement.style.left = '0';
                this.fillElement.style.width = '100%';
            } else {
                this.fillElement.style.left = `${minPercent}%`;
                this.fillElement.style.width = `${maxPercent - minPercent}%`;
                this.fillElement.style.top = '0';
                this.fillElement.style.height = '100%';
            }
            
            // Update thumb positions
            if (isVertical) {
                this.thumbElements[0].style.bottom = `${minPercent}%`;
                this.thumbElements[0].style.top = 'auto';
                this.thumbElements[0].style.left = '50%';
                this.thumbElements[0].style.transform = 'translate(-50%, 50%)';
                
                this.thumbElements[1].style.bottom = `${maxPercent}%`;
                this.thumbElements[1].style.top = 'auto';
                this.thumbElements[1].style.left = '50%';
                this.thumbElements[1].style.transform = 'translate(-50%, 50%)';
            } else {
                this.thumbElements[0].style.left = `${minPercent}%`;
                this.thumbElements[0].style.top = '50%';
                this.thumbElements[0].style.transform = 'translate(-50%, -50%)';
                
                this.thumbElements[1].style.left = `${maxPercent}%`;
                this.thumbElements[1].style.top = '50%';
                this.thumbElements[1].style.transform = 'translate(-50%, -50%)';
            }
            
            // Update aria attributes
            this.thumbElements[0].setAttribute('aria-valuenow', String(minVal));
            this.thumbElements[1].setAttribute('aria-valuenow', String(maxVal));
            this.updateThumbAriaAttributes(this.thumbElements[0], 0);
            this.updateThumbAriaAttributes(this.thumbElements[1], 1);
            
            // Update hidden inputs
            if (this.hiddenInputElements[0]) {
                this.updateHiddenInputAttributes(this.hiddenInputElements[0], 0);
            }
            if (this.hiddenInputElements[1]) {
                this.updateHiddenInputAttributes(this.hiddenInputElements[1], 1);
            }
            
            // Update mark states
            this.updateMarkStates();
            
            // Update tooltips
            this.updateTooltips([minVal, maxVal]);
        } else {
            const value = this.data.value as number;
            const percent = this.valueToPercent(value);
            
            // Update fill
            if (isVertical) {
                if (this.config.track === 'inverted') {
                    this.fillElement.style.top = `${percent}%`;
                    this.fillElement.style.bottom = '0';
                    this.fillElement.style.height = `${100 - percent}%`;
                } else {
                    this.fillElement.style.bottom = '0';
                    this.fillElement.style.top = 'auto';
                    this.fillElement.style.height = `${percent}%`;
                }
                this.fillElement.style.left = '0';
                this.fillElement.style.width = '100%';
            } else {
                if (this.config.track === 'inverted') {
                    this.fillElement.style.right = '0';
                    this.fillElement.style.left = 'auto';
                    this.fillElement.style.width = `${100 - percent}%`;
                } else {
                    this.fillElement.style.left = '0';
                    this.fillElement.style.width = `${percent}%`;
                }
                this.fillElement.style.top = '0';
                this.fillElement.style.height = '100%';
            }
            
            // Update thumb position
            if (isVertical) {
                this.thumbElements[0].style.bottom = `${percent}%`;
                this.thumbElements[0].style.top = 'auto';
                this.thumbElements[0].style.left = '50%';
                this.thumbElements[0].style.transform = 'translate(-50%, 50%)';
            } else {
                this.thumbElements[0].style.left = `${percent}%`;
                this.thumbElements[0].style.top = '50%';
                this.thumbElements[0].style.transform = 'translate(-50%, -50%)';
            }
            
            // Update aria attributes
            this.thumbElements[0].setAttribute('aria-valuenow', String(value));
            this.updateThumbAriaAttributes(this.thumbElements[0], 0);
            
            // Update hidden input
            if (this.hiddenInputElements[0]) {
                this.updateHiddenInputAttributes(this.hiddenInputElements[0], 0);
            }
            
            // Update mark states
            this.updateMarkStates();
            
            // Update tooltip
            this.updateTooltips([value]);
        }
        
        // Restore transitions after animation
        if (transitionEnabled && !this.isDragging) {
            setTimeout(() => {
                this.fillElement!.style.transition = '';
                this.thumbElements.forEach(thumb => {
                    thumb.style.transition = '';
                });
            }, (this.config.animationDuration ?? 300) + 50);
        }
    }
    
    private updateTooltips(values: number[]): void {
        if (this.config.valueLabelDisplay === 'off') return;
        
        values.forEach((value, index) => {
            if (index < this.tooltipElements.length && this.tooltipElements[index]) {
                const tooltip = this.tooltipElements[index];
                const labelElement = this.tooltipLabelElements[index];
                
                if (!labelElement) return;
                
                const formattedValue = this.config.valueLabelFormat 
                    ? this.config.valueLabelFormat(value)
                    : String(value);
                labelElement.textContent = formattedValue;
                
                // Show/hide based on valueLabelDisplay
                if (this.config.valueLabelDisplay === 'on') {
                    tooltip.classList.add('xwui-slider__tooltip--visible');
                    tooltip.classList.add('xwui-slider__tooltip--open');
                } else if (this.config.valueLabelDisplay === 'auto') {
                    // Show on hover/drag
                    if (this.isDragging || this.hoveredThumbIndex === index) {
                        tooltip.classList.add('xwui-slider__tooltip--visible');
                    } else {
                        tooltip.classList.remove('xwui-slider__tooltip--visible');
                    }
                    tooltip.classList.remove('xwui-slider__tooltip--open');
                } else {
                    tooltip.classList.remove('xwui-slider__tooltip--visible');
                    tooltip.classList.remove('xwui-slider__tooltip--open');
                }
            }
        });
    }

    private startDrag(thumbIndex: number, e: MouseEvent | Touch | PointerEvent): void {
        this.isDragging = true;
        this.activeThumbIndex = thumbIndex;
        this.thumbElements[thumbIndex].classList.add('xwui-slider__thumb--active');
        
        // Prevent text selection during drag
        if (e instanceof MouseEvent || e instanceof PointerEvent) {
            e.preventDefault();
        }
        
        // Focus the thumb for accessibility
        this.thumbElements[thumbIndex].focus();
        
        // Initial update
        this.updateFromPointer(e);
    }
    
    private updateFromPointer(e: MouseEvent | Touch | PointerEvent): void {
        if (!this.trackElement) return;
        
        const rect = this.trackElement.getBoundingClientRect();
        const isVertical = this.config.orientation === 'vertical';
        
        let percent: number;
        if (isVertical) {
            const clientY = (e as PointerEvent).clientY ?? (e as MouseEvent).clientY ?? (e as Touch).clientY;
            // For vertical: top (smaller clientY) should be max value, bottom (larger clientY) should be min value
            // So we calculate from top: (clientY - rect.top) / rect.height gives us position from top
            // Then invert: 100 - percent so top is max
            const fromTop = ((clientY - rect.top) / rect.height) * 100;
            percent = Math.max(0, Math.min(100, 100 - fromTop));
        } else {
            const clientX = (e as PointerEvent).clientX ?? (e as MouseEvent).clientX ?? (e as Touch).clientX;
            percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        }
        
        const newValue = this.percentToValue(percent);
        
        // Throttle updates for performance (but not during drag for responsiveness)
        const now = Date.now();
        if (now - this.lastUpdateTime > 8 || !this.pendingUpdate) { // ~120fps max
            this.updateValue(newValue, this.activeThumbIndex, e as Event, false);
            this.lastUpdateTime = now;
            this.pendingUpdate = false;
        } else {
            this.pendingUpdate = true;
        }
    }

    private handlePointerMove(e: PointerEvent): void {
        if (!this.isDragging) return;
        e.preventDefault();
        this.updateFromPointer(e);
    }
    
    private handlePointerUp(e: PointerEvent): void {
        if (this.isDragging) {
            const thumb = this.thumbElements[this.activeThumbIndex];
            if (thumb && typeof thumb.releasePointerCapture === 'function') {
                thumb.releasePointerCapture(e.pointerId);
            }
            this.handleMouseUp();
        }
    }

    private handleMouseMove(e: MouseEvent): void {
        // Fallback handler - pointer events take priority
        if (!this.isDragging) return;
        this.updateFromPointer(e);
    }
    
    private handleTouchMove(e: TouchEvent): void {
        // Fallback handler - pointer events take priority
        if (!this.isDragging || e.touches.length === 0) return;
        e.preventDefault();
        this.updateFromPointer(e.touches[0] as any);
    }

    private handleMouseUp(): void {
        if (this.isDragging) {
            this.isDragging = false;
            this.thumbElements[this.activeThumbIndex]?.classList.remove('xwui-slider__thumb--active');
            
            // Process any pending update
            if (this.pendingUpdate) {
                this.updatePositions(false);
            }
        }
    }
    
    private handleTouchEnd(): void {
        this.handleMouseUp();
    }

    private handleTrackClick(e: MouseEvent | PointerEvent): void {
        if (!this.trackElement) return;
        
        const rect = this.trackElement.getBoundingClientRect();
        const isVertical = this.config.orientation === 'vertical';
        
        let percent: number;
        const clientX = (e as PointerEvent).clientX ?? (e as MouseEvent).clientX;
        const clientY = (e as PointerEvent).clientY ?? (e as MouseEvent).clientY;
        
        if (isVertical) {
            // For vertical: top should be max, bottom should be min
            const fromTop = ((clientY - rect.top) / rect.height) * 100;
            percent = Math.max(0, Math.min(100, 100 - fromTop));
        } else {
            percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        }
        
        const newValue = this.percentToValue(percent);
        
        // For range, find closest thumb (or swap if disableSwap is false)
        if (Array.isArray(this.data.value)) {
            const [minVal, maxVal] = this.data.value;
            let thumbIndex: number;
            
            if (!this.config.disableSwap) {
                // Find closest thumb or swap if needed
                const distToMin = Math.abs(newValue - minVal);
                const distToMax = Math.abs(newValue - maxVal);
                thumbIndex = distToMin < distToMax ? 0 : 1;
                
                // Check if we should swap (hover effect)
                if (thumbIndex === 0 && newValue > maxVal) {
                    thumbIndex = 1;
                } else if (thumbIndex === 1 && newValue < minVal) {
                    thumbIndex = 0;
                }
            } else {
                thumbIndex = Math.abs(newValue - minVal) < Math.abs(newValue - maxVal) ? 0 : 1;
            }
            
            this.updateValue(newValue, thumbIndex, e, true);
        } else {
            this.updateValue(newValue, 0, e, true);
        }
    }

    private handleKeydown(thumbIndex: number, e: KeyboardEvent): void {
        const step = this.config.step ?? 1;
        const shiftStep = this.config.shiftStep ?? 10;
        const min = this.config.min ?? 0;
        const max = this.config.max ?? 100;
        const isVertical = this.config.orientation === 'vertical';
        const useShiftStep = e.shiftKey;
        const stepSize = useShiftStep ? shiftStep : (step ?? 1);
        
        let delta = 0;
        
        switch (e.key) {
            case 'ArrowRight':
                delta = isVertical ? 0 : stepSize;
                break;
            case 'ArrowLeft':
                delta = isVertical ? 0 : -stepSize;
                break;
            case 'ArrowUp':
                delta = isVertical ? stepSize : stepSize;
                break;
            case 'ArrowDown':
                delta = isVertical ? -stepSize : -stepSize;
                break;
            case 'PageUp':
                delta = stepSize * 10;
                break;
            case 'PageDown':
                delta = -stepSize * 10;
                break;
            case 'Home':
                const currentValue = Array.isArray(this.data.value) ? this.data.value[thumbIndex] : (this.data.value as number ?? min);
                delta = min - currentValue;
                break;
            case 'End':
                const currentValueEnd = Array.isArray(this.data.value) ? this.data.value[thumbIndex] : (this.data.value as number ?? min);
                delta = max - currentValueEnd;
                break;
            default:
                return;
        }
        
        if (delta === 0) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const currentValue = Array.isArray(this.data.value) 
            ? this.data.value[thumbIndex] 
            : this.data.value as number;
        const newValue = Math.max(min, Math.min(max, currentValue + delta));
        
        this.updateValue(newValue, thumbIndex, e, true);
    }

    private updateValue(newValue: number, thumbIndex: number, event: Event, animated: boolean = false): void {
        const { min = 0, max = 100, minDistance } = this.config;
        newValue = Math.max(min, Math.min(max, newValue));
        
        // Apply scale if provided
        if (this.config.scale) {
            // Scale transforms the value - for now we'll use it directly
            // In practice, you'd need to apply scale transformation properly
        }
        
        if (Array.isArray(this.data.value)) {
            const newRange = [...this.data.value] as [number, number];
            const oldRange = [...newRange] as [number, number];
            newRange[thumbIndex] = newValue;
            
            // Ensure min <= max
            if (thumbIndex === 0 && newRange[0] > newRange[1]) {
                newRange[0] = newRange[1];
            } else if (thumbIndex === 1 && newRange[1] < newRange[0]) {
                newRange[1] = newRange[0];
            }
            
            // Apply minimum distance constraint
            if (minDistance !== undefined && minDistance > 0) {
                const distance = newRange[1] - newRange[0];
                if (distance < minDistance) {
                    if (thumbIndex === 0) {
                        newRange[0] = Math.max(min, newRange[1] - minDistance);
                    } else {
                        newRange[1] = Math.min(max, newRange[0] + minDistance);
                    }
                }
            }
            
            this.data.value = newRange;
        } else {
            this.data.value = newValue;
        }
        
        // Update positions with animation option
        this.updatePositions(animated);
        
        // Update linked sliders
        if (this.config.linkedSliders && this.config.linkedSliders.length > 0) {
            this.updateLinkedSliders(event);
        }
        
        // Trigger change handlers
        this.changeHandlers.forEach(handler => handler(this.data.value!, event));
    }
    
    private updateLinkedSliders(event: Event): void {
        if (!this.config.linkedSliders) return;
        
        const currentValue = Array.isArray(this.data.value) 
            ? (this.data.value as [number, number])[0] 
            : (this.data.value as number);
        
        this.config.linkedSliders.forEach(linked => {
            if (!linked.slider || linked.slider === this) return;
            
            try {
                const linkedValue = linked.slider.getValue();
                const baseValue = Array.isArray(linkedValue) ? linkedValue[0] : linkedValue;
                
                // Calculate new value based on ratio and inversion
                let newLinkedValue = currentValue * (linked.ratio ?? 1);
                if (linked.invert) {
                    const max = linked.slider.config.max ?? 100;
                    const min = linked.slider.config.min ?? 0;
                    newLinkedValue = max - (newLinkedValue - min);
                }
                
                // Update linked slider (prevent circular updates)
                if (Array.isArray(linkedValue)) {
                    linked.slider.setValue([newLinkedValue, linkedValue[1]]);
                } else {
                    linked.slider.setValue(newLinkedValue);
                }
            } catch (error) {
                console.warn('Error updating linked slider:', error);
            }
        });
    }

    public getValue(): number | [number, number] | undefined {
        return this.data.value;
    }

    public setValue(value: number | [number, number], animated: boolean = true): void {
        this.data.value = value;
        this.updatePositions(animated && this.config.animateOnSet !== false);
    }

    public setDisabled(disabled: boolean): void {
        this.config.disabled = disabled;
        if (this.wrapperElement) {
            if (disabled) {
                this.wrapperElement.classList.add('xwui-slider--disabled');
                this.thumbElements.forEach(thumb => {
                    thumb.setAttribute('tabindex', '-1');
                });
            } else {
                this.wrapperElement.classList.remove('xwui-slider--disabled');
                this.thumbElements.forEach(thumb => {
                    thumb.setAttribute('tabindex', '0');
                });
            }
        }
    }

    public onChange(handler: (value: number | [number, number], event: Event) => void): void {
        this.changeHandlers.push(handler);
    }
    
    public removeOnChange(handler: (value: number | [number, number], event: Event) => void): void {
        const index = this.changeHandlers.indexOf(handler);
        if (index > -1) {
            this.changeHandlers.splice(index, 1);
        }
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        // Clean up change handlers
        this.changeHandlers = [];

        // Cancel any pending animation frame
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Remove global event listeners
        document.removeEventListener('pointermove', this.boundPointerMove);
        document.removeEventListener('pointerup', this.boundPointerUp);
        document.removeEventListener('mousemove', this.boundMouseMove);
        document.removeEventListener('mouseup', this.boundMouseUp);
        document.removeEventListener('touchmove', this.boundTouchMove);
        document.removeEventListener('touchend', this.boundTouchEnd);

        // Clear DOM references
        this.container.innerHTML = '';
        
        // Clear local references
        this.wrapperElement = null;
        this.labelElement = null;
        this.titleElement = null;
        this.sliderContainer = null;
        this.trackElement = null;
        this.railElement = null;
        this.fillElement = null;
        this.thumbElements = [];
        this.hiddenInputElements = [];
        this.tooltipElements = [];
        this.tooltipLabelElements = [];
        this.marksContainer = null;
        this.startIconElement = null;
        this.endIconElement = null;
        this.stepperContainer = null;
        
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISlider as any).componentName = 'XWUISlider';


