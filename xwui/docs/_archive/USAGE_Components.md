# XWUI Components Reference

This document lists all available XWUI components with their descriptions.

**Total Components:** 190

---

## Base Components

### XWUIComponent

XWUIComponent Base Class Base class for all XWUI components providing common configuration pattern: - conf_sys: System-level configuration (admin-editable) - conf_usr: User-level configuration (user preferences) - conf_comp: Component-level configuration (instance-specific) - schema: JSON schema path - data: Component data

### XWUIComponentPropertyForm

XWUIComponentPropertyForm Component Converts a JSON schema to an editable form using XWUIForm. Automatically generates appropriate input components based on schema types. Supports read and write modes. Can read JSON schema from a file path or URL.

### XWUIItem

XWUIItem Component A single item UI element that takes a JSON config and converts it into HTML For multiple items, use XWUIItemGroup This component accepts exactly ONE JSON item configuration following the schema defined in XWUIItem.schema.json @schema See XWUIItem.schema.json for the authoritative JSON schema

### XWUIItemGroup

XWUIItemGroup Component A container for multiple XWUIItems that handles lists/trees of items

---

## Layout Components

### XWUIAppBar

XWUIAppBar Component Layout header component with logo, navigation, and actions areas

### XWUIAppShell

XWUIAppShell Component Complete app layout structure with header, sidebar, main content, footer areas

### XWUIAspectRatio

XWUIAspectRatio Component Container that maintains a specific aspect ratio

### XWUIBox

XWUIBox Component Basic layout container with flexible styling Can be used as a generic container with customizable props

### XWUICenter

XWUICenter Component Center content horizontally and/or vertically

### XWUICheckbox

XWUICheckbox Component Checkbox input with label support and indeterminate state

### XWUIContainer

XWUIContainer Component Container with max-width and optional centering Typically used for page/content containers

### XWUIDataGrid

XWUIDataGrid Component Advanced data grid with custom column renderers and enhanced features

### XWUIFlex

XWUIFlex Component Flexbox layout container

### XWUIGrid

XWUIGrid Component CSS Grid wrapper with responsive breakpoints

### XWUIMasonry

XWUIMasonry Component Pinterest-style masonry grid layout for items of different heights

### XWUISidebar

XWUISidebar Component Sidebar navigation component

### XWUISpace

XWUISpace Component Add spacing between elements

### XWUIStack

XWUIStack Component Stack layout (vertical flex with spacing)

---

## Form Components

### XWUIAutocomplete

XWUIAutocomplete Component Autocomplete/combobox with search

### XWUICascader

XWUICascader Component Cascading dropdown selection

### XWUIColorPicker

XWUIColorPicker Component Color picker input NOTE: This component is now a wrapper around XWUIInputColor for backward compatibility. For new code, use XWUIInputColor directly.

### XWUIDatePicker

XWUIDatePicker Component Calendar date selection component NOTE: This component is now a wrapper around XWUIInputDate for backward compatibility. For new code, use XWUIInputDate directly.

### XWUIDateRangePicker

XWUIDateRangePicker Component Date range selection NOTE: This component is now a wrapper around XWUIInputDateRange for backward compatibility. For new code, use XWUIInputDateRange directly.

### XWUIDurationPicker

XWUIDurationPicker Component Combined hours and minutes input for time duration

### XWUIDynamicFieldRenderer

XWUIDynamicFieldRenderer Component Render custom field types dynamically in forms and views

### XWUIField

XWUIField Component Form field wrapper with label, input, and error message

### XWUIForm

XWUIForm Component Form wrapper with validation

### XWUIFormEditor

XWUIFormEditor Component Visual form builder with drag-and-drop support Reuses existing XWUI input components

### XWUIInput

XWUIInput Component Text input with various types and states

### XWUIInputChat

XWUIInputChat Component Auto-resizing textarea with file attachment and send button

### XWUIInputColor

XWUIInputColor Component Color input with picker - combines XWUIInput with XWUIPickerColor

### XWUIInputDate

XWUIInputDate Component Date input with picker - combines XWUIInput with XWUIPickerDate

### XWUIInputDateRange

XWUIInputDateRange Component Date range input with picker - combines XWUIInput with XWUIPickerDateRange

### XWUIInputGroup

XWUIInputGroup Component Input with prefix/suffix elements

### XWUIInputJson

XWUIInputJson Component JSON input with validation Extends XWUITextarea with JSON validation

### XWUIInputLocation

XWUIInputLocation Component Location picker input with map integration

### XWUIInputNumber

XWUIInputNumber Component Dedicated number input with increment/decrement controls

### XWUIInputOTP

XWUIInputOTP Component One-time password input with multiple digits

### XWUIInputPassword

XWUIInputPassword Component Dedicated password input with visibility toggle Wraps XWUIInput with password-specific defaults

### XWUIInputPicker

XWUIInputPicker Base Component Base composition component that combines XWUIInput with a picker Supports full view (inline) and minimized view (popup)

### XWUIJsonInput

XWUIInputJson Component JSON input with validation Extends XWUITextarea with JSON validation

### XWUIMentions

XWUIMentions Component Mentions input (@ mentions) Extends XWUITextarea with mention detection

### XWUIMultiSelect

XWUIMultiSelect Component Multi-select dropdown (enhancement to XWUISelect) Wraps XWUISelect with multiple mode enabled

### XWUINativeSelect

XWUINativeSelect Component Wrapper for browser native <select> element Critical for mobile UX and accessibility

### XWUIPicker

XWUIPicker Base Component Abstract base class for all picker components (date, color, etc.) Handles common picker functionality: positioning, overlay, open/close, animation

### XWUIPickerColor

XWUIPickerColor Component Color picker (popup) - extends XWUIPicker This is the popup/overlay part for color selection

### XWUIPickerDate

XWUIPickerDate Component Date picker (calendar popup) - extends XWUIPicker This is the popup/overlay part for date selection

### XWUIPickerDateRange

XWUIPickerDateRange Component Date range picker (calendar popup for range selection) - extends XWUIPicker This is the popup/overlay part for date range selection

### XWUIRadioGroup

XWUIRadioGroup Component Radio button group with horizontal/vertical layouts

### XWUIRangeSlider

XWUIRangeSlider Component Dual-thumb slider for range selection Wraps XWUISlider with range mode enabled

### XWUIRating

XWUIRating Component Star/icon rating input

### XWUIReactionSelector

XWUIReactionSelector Component Emoji reaction selector with popover

### XWUIRecurrencePicker

XWUIRecurrencePicker Component Configure recurring task patterns (daily, weekly, monthly, yearly, custom)

### XWUISegmentedControl

XWUISegmentedControl Component Segmented button control (single selection)

### XWUISelect

XWUISelect Component Dropdown select with single and multi-select modes

### XWUISlider

XWUISlider Component - Production Quality High-performance slider with MUI-like features and 100% styles system integration Features: Performance optimized, value labels, icons, thumb customization, range slider, linked sliders, steppers, non-linear scale, track options, smooth animations

### XWUIStyleSelector

XWUIStyleSelector Component Dynamically generates form fields based on styles.schema.json Loads options from styles.data.json Automatically applies changes to XWUIStyle

### XWUISwitch

XWUISwitch Component Toggle switch component

### XWUITaskTemplateSelector

XWUITaskTemplateSelector Component Select and apply task/project templates

### XWUITextarea

XWUITextarea Component Multi-line text input with auto-resize option

### XWUITimeline

XWUITimeline Component - Production Quality High-performance timeline with MUI-like features and 100% styles system integration Features: Semantic HTML, ARIA attributes, theme colors, multiple positioning modes, opposite content support, icon customization, smooth animations, accessibility

### XWUITimelineZoom

XWUITimelineZoom Component Zoom controls for timeline views (day/week/month/year)

### XWUITimePicker

XWUITimePicker Component Time selection component (12h/24h formats)

### XWUITimeTracker

XWUITimeTracker Component Start/stop timer with time logging and manual entry

### XWUITree

XWUITree Component Tree structure display with expand/collapse and selection

### XWUITreeSelect

XWUITreeSelect Component Tree select dropdown Combines Tree + Select functionality

### XWUIUpload

XWUIUpload Component File upload component with drag-and-drop

---

## Navigation Components

### XWUIAnchor

XWUIAnchor Component Table of contents / anchor navigation with scroll spy

### XWUIBackToTop

XWUIBackToTop Component Floating button to scroll to top

### XWUIBottomNavigation

XWUIBottomNavigation Component Bottom navigation bar for mobile app navigation

### XWUIBreadcrumbs

XWUIBreadcrumbs Component Path navigation breadcrumbs

### XWUIMenu

XWUIMenu Component Navigation menu component

### XWUIMenubar

XWUIMenuBar Component Menu bar component (typically for desktop applications)

### XWUIMenuContext

XWUIMenuContext Component Right-click context menu

### XWUIMenuDrawer

XWUIMenuDrawer Component Sliding panel (Side Sheet) with placement options

### XWUIMenuDrawerSwipeable

XWUIMenuDrawerSwipeable Component Swipeable drawer component with touch gesture support Extends XWUIMenuDrawer functionality with swipe-to-close gestures

### XWUIMenuDropdown

XWUIMenuDropdown Component Dropdown menu triggered by button/action

### XWUIMenuNavigation

XWUIMenuNavigation Component Navigation menu component (separate from Menu)

### XWUINavigationRail

XWUINavigationRail Component Mobile bottom navigation bar with icon + label items

### XWUIPagination

XWUIPagination Component Page navigation component

### XWUIScrollTo

XWUIScrollTo Component Smooth scroll to target element

### XWUISteps

XWUISteps Component Step progress indicator (Stepper)

### XWUITabs

XWUITabs Component Tab navigation with various variants

---

## Data Display Components

### XWUIAvatar

XWUIAvatar Component User avatar with image/initials fallback

### XWUIAvatarGroup

XWUIAvatarGroup Component Group of avatars with overflow handling

### XWUIBadge

XWUIBadge Component Count/status badge

### XWUICard

XWUICard Component Content card container with header, body, footer slots

### XWUIChannelList

XWUIChannelList Component Enhanced channel list with unread counts, last message preview, and search

### XWUIChip

XWUIChip Component Tag/chip element with closable and clickable variants

### XWUIDescriptionList

XWUIDescriptionList Component Description list (term-value pairs)

### XWUIEmpty

XWUIEmpty Component Empty state component

### XWUIHoverCard

XWUIHoverCard Component Popover triggered on hover Wraps XWUIPopover with hover-specific defaults

### XWUIImage

XWUIImage Component Enhanced image wrapper with fallbacks, placeholders, and lazy loading

### XWUIList

XWUIList Component List component using XWUIItemGroup

### XWUIPivotTable

XWUIPivotTable Component Pivot table with drag-and-drop field configuration

### XWUIPopover

XWUIPopover Component Content popover on hover/click (Hover Card)

### XWUIQRCode

XWUIQRCode Component QR code display Simplified version using canvas

### XWUISortableList

XWUISortableList Component Drag-and-drop sortable list with HTML5 drag API

### XWUISpoiler

XWUISpoiler Component Collapsible content with "show more" toggle

### XWUIStatistic

XWUIStatistic Component Display statistics/counts

### XWUITable

XWUITable Component Data table with sorting, filtering, and selection

### XWUITooltip

XWUITooltip Component Hover tooltip with placement options

### XWUITransferList

XWUITransferList Component Double-list component to move items between "Source" and "Target" Used for assigning permissions, moving items, etc.

---

## Feedback Components

### XWUIAlert

XWUIAlert Component Alert message box with variants

### XWUIBackdrop

XWUIBackdrop Component Overlay backdrop component for modals, dialogs, and drawers

### XWUIDialog

XWUIDialog Component Modal dialog with configurable header, body, footer

### XWUIPopconfirm

XWUIPopconfirm Component Popover with confirmation action Extends or composes XWUIPopover with confirm/cancel buttons

### XWUIProgress

XWUIProgress Component Progress bar with linear and circular variants

### XWUIProgressBySubtasks

XWUIProgressBySubtasks Component Auto-calculate parent task progress based on subtask completion

### XWUIResult

XWUIResult Component Result page/section with icons for success, error, info, warning

### XWUISkeleton

XWUISkeleton Component Loading skeleton placeholder

### XWUISpinner

XWUISpinner Component Loading spinner with overlay option

### XWUIToast

XWUIToast Component Toast notification system

### XWUITour

XWUITour Component Step-by-step guide/tour

### XWUIWatermark

XWUIWatermark Component Watermark overlay

---

## Editor Components

### XWUIAudioEditor

XWUIAudioEditor Component Audio editor with basic editing tools Reuses: XWUIAudioPlayer, XWUIButton, XWUISlider

### XWUIAudioPlayer

XWUIAudioPlayer Component Audio player with controls Reuses: XWUIButton, XWUISlider, XWUIProgress

### XWUIAudioRecorder

XWUIAudioRecorder Component Audio recorder using MediaRecorder API Reuses: XWUIButton, XWUIProgress

### XWUICodeBlock

XWUICodeBlock Component Syntax-highlighted code block with Prism.js

### XWUIDiffEditor

XWUIDiffEditor Component Side-by-side code/file comparison tool

### XWUIGalleryEditor

XWUIGalleryEditor Component Gallery editor with upload and management Reuses: XWUIGalleryViewer, XWUIUpload, XWUIButton, XWUIDialog

### XWUIGalleryViewer

XWUIGalleryViewer Component Image gallery viewer with grid layout, lightbox, and navigation Reuses: XWUIGrid, XWUICard, XWUIDialog, XWUICarousel, XWUIButton, XWUIPagination

### XWUIPhotoEditor

XWUIPhotoEditor Component Photo/image editor with basic editing tools Reuses: XWUIButton, XWUISlider, XWUIUpload, XWUIDialog

### XWUIRichTextEditor

XWUIRichTextEditor Component Rich text/WYSIWYG editor Simplified version using contenteditable

### XWUIScriptEditor

XWUIScriptEditor Component Multi-editor code editor component supporting multiple editor engines Uses centralized grammar system for all engines

### XWUIVideoEditor

XWUIVideoEditor Component Video editor with basic editing tools Reuses: XWUIVideoPlayer, XWUIButton, XWUISlider, XWUIUpload

### XWUIVideoPlayer

XWUIVideoPlayer Component Video player with controls using native HTML5 video Reuses: XWUIButton, XWUISlider, XWUIProgress, XWUIAspectRatio

### XWUIVideoRecorder

XWUIVideoRecorder Component Video recorder using MediaRecorder API Reuses: XWUIButton, XWUIProgress, XWUIVideoPlayer

---

## Advanced Components

### XWUIApprovalWorkflow

XWUIApprovalWorkflow Component Visual approval workflow with status transitions

### XWUICalendar

XWUICalendar Component Full calendar view with month/week/day views

### XWUIChart

XWUIChart Component Chart component (basic implementation - can be extended with chart libraries)

### XWUIDependencyVisualizer

XWUIDependencyVisualizer Component Visualize task dependencies, blocking relationships, and predecessor/successor links

### XWUIDiagram

XWUIDiagram Component Diagram/flowchart builder with nodes and connections

### XWUIGanttChart

XWUIGanttChart Component Horizontal timeline/Gantt chart with task bars, dependencies, and critical path visualization

### XWUIKanbanBoard

XWUIKanbanBoard Component Kanban board with columns and drag-and-drop between columns

### XWUIMap

XWUIMap Component Google Maps integration with marker support

### XWUIPortfolioDashboard

XWUIPortfolioDashboard Component Multi-project overview dashboard with health indicators and metrics

### XWUIResourceAllocationChart

XWUIResourceAllocationChart Component Visual resource allocation and capacity planning chart

### XWUISpreadsheet

XWUISpreadsheet Component Excel-like spreadsheet with formulas, formatting, and editing

### XWUIWorkflow

XWUIWorkflow Component Interactive workflow visualization component with nodes and connections

---

## Other Components

### XWUIAccordion

XWUIAccordion Component Multiple collapsible sections with single/multiple open modes

### XWUIActivityFilter

XWUIActivityFilter Component Filter and search activity stream by type, user, date range

### XWUIAffix

XWUIAffix Component Pin element to viewport when scrolling

### XWUIBottomSheet

XWUIBottomSheet Component Mobile-style modal sliding up from bottom

### XWUIBrightness

XWUIBrightness Component Controls the brightness of components with a scroll-based slider control Reuses: XWUISlider

### XWUIBulkActionBar

XWUIBulkActionBar Component Toolbar that appears when multiple items are selected for bulk operations

### XWUIButton

XWUIButton Component A button component with various styles and states Uses XWUIItem internally for flexible styling and JSON configuration

### XWUIButtonGroup

XWUIButtonGroup Component Group of buttons

### XWUICarousel

XWUICarousel Component Image/content carousel with auto-play and navigation

### XWUIChangeDiffViewer

XWUIChangeDiffViewer Component Display field changes with before/after comparison

### XWUICollapse

XWUICollapse Component Animated expand/collapse container

### XWUICommand

XWUICommand Component Command palette / command menu component

### XWUIConsole

XWUIConsole Component A console component similar to Chrome DevTools console Displays logs, errors, warnings, and info messages with filtering

### XWUICopyButton

XWUICopyButton Component A button component specifically for copying text to clipboard Shows "Copied!" feedback after successful copy

### XWUIDebugToolbar

XWUIDebugToolbar Component Debug toolbar with play/pause/step controls and breakpoint management

### XWUIFilePreview

XWUIFilePreview Component Inline preview of uploaded files (PDF, images, documents)

### XWUIFilters

XWUIFilters Component Enhanced image filters with presets and custom filter creation

### XWUIFocusTrap

XWUIFocusTrap Component Utility component to trap focus within a container Essential for accessible Modals, Drawers, and Popovers

### XWUIFollowIndicator

XWUIFollowIndicator Component Visual indicator for following/watching tasks or projects

### XWUIHidden

XWUIHidden Component Show/hide content based on breakpoints Similar to Material UI's Hidden component

### XWUIIcon

XWUIIcon Component Dynamic icon component that can use icons from multiple icon libraries Uses the master icon mapping to resolve icons across different libraries

### XWUIKbd

XWUIKbd Component Keyboard key display component

### XWUILabel

XWUILabel Component Form label component

### XWUIMediaQuery

XWUIMediaQuery Component Wrapper that shows/hides content based on media query matches

### XWUIMessageBubble

XWUIMessageBubble Component Chat message display with sender alignment and timestamp

### XWUIMilestoneMarker

XWUIMilestoneMarker Component Visual milestone indicators in timeline and project views

### XWUIMobileStepper

XWUIMobileStepper Component Mobile-optimized stepper component with dots and navigation buttons Based on MUI MobileStepper pattern

### XWUIPDFViewer

XWUIPDFViewer Component Enhanced PDF viewer with PDF.js integration

### XWUIPortal

XWUIPortal Component Render children into a DOM node outside the component hierarchy Useful for modals, tooltips, dropdowns that need to escape parent containers

### XWUIResizable

XWUIResizable Component Resizable container component

### XWUIResizablePanel

XWUIResizablePanel Component Split-panel with two resizable panes and a draggable divider

### XWUIScrollArea

XWUIScrollArea Component Custom scrollable area

### XWUISectionGrouping

XWUISectionGrouping Component Group tasks/projects into sections in board and list views

### XWUISeparator

XWUISeparator Component Visual separator/divider component

### XWUISignaturePad

XWUISignaturePad Component Canvas-based signature pad for drawing signatures

### XWUISkipLink

XWUISkipLink Component Accessibility skip navigation link

### XWUISpeedDial

XWUISpeedDial Component Floating action button with expandable menu

### XWUISplitButton

XWUISplitButton Component Button with main action and dropdown arrow for secondary actions

### XWUIStickersOverlay

XWUIStickersOverlay Component Sticker picker and overlay for adding stickers to canvas

### XWUIStyle

XWUIStyle Component Automatically loads and applies theme CSS files based on configuration Uses styles.data.json and ThemeLoader

### XWUISubtaskExpander

XWUISubtaskExpander Component Inline expandable subtasks in table/grid views

### XWUITester

XWUITester Component Base tester component for all XWUI component testers

### XWUITextOverlay

XWUITextOverlay Component Text overlay for adding text to canvas with formatting options

### XWUIThread

XWUIThread Component Scrollable message thread with multiple message bubbles

### XWUIToggleGroup

XWUIToggleGroup Component Group of toggle buttons

### XWUITransition

XWUITransition Component Animation wrapper component for enter/exit transitions Supports fade, slide, scale, grow, and collapse transitions

### XWUITypingIndicator

XWUITypingIndicator Component Animated typing indicator showing "User is typing..." with animated dots

### XWUITypography

XWUITypography Component Typography/text component with variants

### XWUIVisuallyHidden

XWUIVisuallyHidden Component Hide content visually while keeping it accessible to screen readers Follows ARIA best practices for visually hidden content

### XWUIWorkloadView

XWUIWorkloadView Component Resource allocation view showing tasks per person and capacity

---

## Alphabetical Index

| Component | Description |
|-----------|-------------|
| XWUIAccordion | XWUIAccordion Component Multiple collapsible sections with single/multiple open modes |
| XWUIActivityFilter | XWUIActivityFilter Component Filter and search activity stream by type, user, date range |
| XWUIAffix | XWUIAffix Component Pin element to viewport when scrolling |
| XWUIAlert | XWUIAlert Component Alert message box with variants |
| XWUIAnchor | XWUIAnchor Component Table of contents / anchor navigation with scroll spy |
| XWUIAppBar | XWUIAppBar Component Layout header component with logo, navigation, and actions areas |
| XWUIApprovalWorkflow | XWUIApprovalWorkflow Component Visual approval workflow with status transitions |
| XWUIAppShell | XWUIAppShell Component Complete app layout structure with header, sidebar, main content, footer area |
| XWUIAspectRatio | XWUIAspectRatio Component Container that maintains a specific aspect ratio |
| XWUIAudioEditor | XWUIAudioEditor Component Audio editor with basic editing tools Reuses: XWUIAudioPlayer, XWUIButton, |
| XWUIAudioPlayer | XWUIAudioPlayer Component Audio player with controls Reuses: XWUIButton, XWUISlider, XWUIProgress |
| XWUIAudioRecorder | XWUIAudioRecorder Component Audio recorder using MediaRecorder API Reuses: XWUIButton, XWUIProgress |
| XWUIAutocomplete | XWUIAutocomplete Component Autocomplete/combobox with search |
| XWUIAvatar | XWUIAvatar Component User avatar with image/initials fallback |
| XWUIAvatarGroup | XWUIAvatarGroup Component Group of avatars with overflow handling |
| XWUIBackdrop | XWUIBackdrop Component Overlay backdrop component for modals, dialogs, and drawers |
| XWUIBackToTop | XWUIBackToTop Component Floating button to scroll to top |
| XWUIBadge | XWUIBadge Component Count/status badge |
| XWUIBottomNavigation | XWUIBottomNavigation Component Bottom navigation bar for mobile app navigation |
| XWUIBottomSheet | XWUIBottomSheet Component Mobile-style modal sliding up from bottom |
| XWUIBox | XWUIBox Component Basic layout container with flexible styling Can be used as a generic container wi |
| XWUIBreadcrumbs | XWUIBreadcrumbs Component Path navigation breadcrumbs |
| XWUIBrightness | XWUIBrightness Component Controls the brightness of components with a scroll-based slider control Re |
| XWUIBulkActionBar | XWUIBulkActionBar Component Toolbar that appears when multiple items are selected for bulk operation |
| XWUIButton | XWUIButton Component A button component with various styles and states Uses XWUIItem internally for  |
| XWUIButtonGroup | XWUIButtonGroup Component Group of buttons |
| XWUICalendar | XWUICalendar Component Full calendar view with month/week/day views |
| XWUICard | XWUICard Component Content card container with header, body, footer slots |
| XWUICarousel | XWUICarousel Component Image/content carousel with auto-play and navigation |
| XWUICascader | XWUICascader Component Cascading dropdown selection |
| XWUICenter | XWUICenter Component Center content horizontally and/or vertically |
| XWUIChangeDiffViewer | XWUIChangeDiffViewer Component Display field changes with before/after comparison |
| XWUIChannelList | XWUIChannelList Component Enhanced channel list with unread counts, last message preview, and search |
| XWUIChart | XWUIChart Component Chart component (basic implementation - can be extended with chart libraries) |
| XWUICheckbox | XWUICheckbox Component Checkbox input with label support and indeterminate state |
| XWUIChip | XWUIChip Component Tag/chip element with closable and clickable variants |
| XWUICodeBlock | XWUICodeBlock Component Syntax-highlighted code block with Prism |
| XWUICollapse | XWUICollapse Component Animated expand/collapse container |
| XWUIColorPicker | XWUIColorPicker Component Color picker input NOTE: This component is now a wrapper around XWUIInputC |
| XWUICommand | XWUICommand Component Command palette / command menu component |
| XWUIComponent | XWUIComponent Base Class Base class for all XWUI components providing common configuration pattern:  |
| XWUIComponentPropertyForm | XWUIComponentPropertyForm Component Converts a JSON schema to an editable form using XWUIForm |
| XWUIConsole | XWUIConsole Component A console component similar to Chrome DevTools console Displays logs, errors,  |
| XWUIContainer | XWUIContainer Component Container with max-width and optional centering Typically used for page/cont |
| XWUICopyButton | XWUICopyButton Component A button component specifically for copying text to clipboard Shows "Copied |
| XWUIDataGrid | XWUIDataGrid Component Advanced data grid with custom column renderers and enhanced features |
| XWUIDatePicker | XWUIDatePicker Component Calendar date selection component NOTE: This component is now a wrapper aro |
| XWUIDateRangePicker | XWUIDateRangePicker Component Date range selection NOTE: This component is now a wrapper around XWUI |
| XWUIDebugToolbar | XWUIDebugToolbar Component Debug toolbar with play/pause/step controls and breakpoint management |
| XWUIDependencyVisualizer | XWUIDependencyVisualizer Component Visualize task dependencies, blocking relationships, and predeces |
| XWUIDescriptionList | XWUIDescriptionList Component Description list (term-value pairs) |
| XWUIDiagram | XWUIDiagram Component Diagram/flowchart builder with nodes and connections |
| XWUIDialog | XWUIDialog Component Modal dialog with configurable header, body, footer |
| XWUIDiffEditor | XWUIDiffEditor Component Side-by-side code/file comparison tool |
| XWUIDurationPicker | XWUIDurationPicker Component Combined hours and minutes input for time duration |
| XWUIDynamicFieldRenderer | XWUIDynamicFieldRenderer Component Render custom field types dynamically in forms and views |
| XWUIEmpty | XWUIEmpty Component Empty state component |
| XWUIField | XWUIField Component Form field wrapper with label, input, and error message |
| XWUIFilePreview | XWUIFilePreview Component Inline preview of uploaded files (PDF, images, documents) |
| XWUIFilters | XWUIFilters Component Enhanced image filters with presets and custom filter creation |
| XWUIFlex | XWUIFlex Component Flexbox layout container |
| XWUIFocusTrap | XWUIFocusTrap Component Utility component to trap focus within a container Essential for accessible  |
| XWUIFollowIndicator | XWUIFollowIndicator Component Visual indicator for following/watching tasks or projects |
| XWUIForm | XWUIForm Component Form wrapper with validation |
| XWUIFormEditor | XWUIFormEditor Component Visual form builder with drag-and-drop support Reuses existing XWUI input c |
| XWUIGalleryEditor | XWUIGalleryEditor Component Gallery editor with upload and management Reuses: XWUIGalleryViewer, XWU |
| XWUIGalleryViewer | XWUIGalleryViewer Component Image gallery viewer with grid layout, lightbox, and navigation Reuses:  |
| XWUIGanttChart | XWUIGanttChart Component Horizontal timeline/Gantt chart with task bars, dependencies, and critical  |
| XWUIGrid | XWUIGrid Component CSS Grid wrapper with responsive breakpoints |
| XWUIHidden | XWUIHidden Component Show/hide content based on breakpoints Similar to Material UI's Hidden componen |
| XWUIHoverCard | XWUIHoverCard Component Popover triggered on hover Wraps XWUIPopover with hover-specific defaults |
| XWUIIcon | XWUIIcon Component Dynamic icon component that can use icons from multiple icon libraries Uses the m |
| XWUIImage | XWUIImage Component Enhanced image wrapper with fallbacks, placeholders, and lazy loading |
| XWUIInput | XWUIInput Component Text input with various types and states |
| XWUIInputChat | XWUIInputChat Component Auto-resizing textarea with file attachment and send button |
| XWUIInputColor | XWUIInputColor Component Color input with picker - combines XWUIInput with XWUIPickerColor |
| XWUIInputDate | XWUIInputDate Component Date input with picker - combines XWUIInput with XWUIPickerDate |
| XWUIInputDateRange | XWUIInputDateRange Component Date range input with picker - combines XWUIInput with XWUIPickerDateRa |
| XWUIInputGroup | XWUIInputGroup Component Input with prefix/suffix elements |
| XWUIInputJson | XWUIInputJson Component JSON input with validation Extends XWUITextarea with JSON validation |
| XWUIInputLocation | XWUIInputLocation Component Location picker input with map integration |
| XWUIInputNumber | XWUIInputNumber Component Dedicated number input with increment/decrement controls |
| XWUIInputOTP | XWUIInputOTP Component One-time password input with multiple digits |
| XWUIInputPassword | XWUIInputPassword Component Dedicated password input with visibility toggle Wraps XWUIInput with pas |
| XWUIInputPicker | XWUIInputPicker Base Component Base composition component that combines XWUIInput with a picker Supp |
| XWUIItem | XWUIItem Component A single item UI element that takes a JSON config and converts it into HTML For m |
| XWUIItemGroup | XWUIItemGroup Component A container for multiple XWUIItems that handles lists/trees of items |
| XWUIJsonInput | XWUIInputJson Component JSON input with validation Extends XWUITextarea with JSON validation |
| XWUIKanbanBoard | XWUIKanbanBoard Component Kanban board with columns and drag-and-drop between columns |
| XWUIKbd | XWUIKbd Component Keyboard key display component |
| XWUILabel | XWUILabel Component Form label component |
| XWUIList | XWUIList Component List component using XWUIItemGroup |
| XWUIMap | XWUIMap Component Google Maps integration with marker support |
| XWUIMasonry | XWUIMasonry Component Pinterest-style masonry grid layout for items of different heights |
| XWUIMediaQuery | XWUIMediaQuery Component Wrapper that shows/hides content based on media query matches |
| XWUIMentions | XWUIMentions Component Mentions input (@ mentions) Extends XWUITextarea with mention detection |
| XWUIMenu | XWUIMenu Component Navigation menu component |
| XWUIMenubar | XWUIMenuBar Component Menu bar component (typically for desktop applications) |
| XWUIMenuContext | XWUIMenuContext Component Right-click context menu |
| XWUIMenuDrawer | XWUIMenuDrawer Component Sliding panel (Side Sheet) with placement options |
| XWUIMenuDrawerSwipeable | XWUIMenuDrawerSwipeable Component Swipeable drawer component with touch gesture support Extends XWUI |
| XWUIMenuDropdown | XWUIMenuDropdown Component Dropdown menu triggered by button/action |
| XWUIMenuNavigation | XWUIMenuNavigation Component Navigation menu component (separate from Menu) |
| XWUIMessageBubble | XWUIMessageBubble Component Chat message display with sender alignment and timestamp |
| XWUIMilestoneMarker | XWUIMilestoneMarker Component Visual milestone indicators in timeline and project views |
| XWUIMobileStepper | XWUIMobileStepper Component Mobile-optimized stepper component with dots and navigation buttons Base |
| XWUIMultiSelect | XWUIMultiSelect Component Multi-select dropdown (enhancement to XWUISelect) Wraps XWUISelect with mu |
| XWUINativeSelect | XWUINativeSelect Component Wrapper for browser native <select> element Critical for mobile UX and ac |
| XWUINavigationRail | XWUINavigationRail Component Mobile bottom navigation bar with icon + label items |
| XWUIPagination | XWUIPagination Component Page navigation component |
| XWUIPDFViewer | XWUIPDFViewer Component Enhanced PDF viewer with PDF |
| XWUIPhotoEditor | XWUIPhotoEditor Component Photo/image editor with basic editing tools Reuses: XWUIButton, XWUISlider |
| XWUIPicker | XWUIPicker Base Component Abstract base class for all picker components (date, color, etc |
| XWUIPickerColor | XWUIPickerColor Component Color picker (popup) - extends XWUIPicker This is the popup/overlay part f |
| XWUIPickerDate | XWUIPickerDate Component Date picker (calendar popup) - extends XWUIPicker This is the popup/overlay |
| XWUIPickerDateRange | XWUIPickerDateRange Component Date range picker (calendar popup for range selection) - extends XWUIP |
| XWUIPivotTable | XWUIPivotTable Component Pivot table with drag-and-drop field configuration |
| XWUIPopconfirm | XWUIPopconfirm Component Popover with confirmation action Extends or composes XWUIPopover with confi |
| XWUIPopover | XWUIPopover Component Content popover on hover/click (Hover Card) |
| XWUIPortal | XWUIPortal Component Render children into a DOM node outside the component hierarchy Useful for moda |
| XWUIPortfolioDashboard | XWUIPortfolioDashboard Component Multi-project overview dashboard with health indicators and metrics |
| XWUIProgress | XWUIProgress Component Progress bar with linear and circular variants |
| XWUIProgressBySubtasks | XWUIProgressBySubtasks Component Auto-calculate parent task progress based on subtask completion |
| XWUIQRCode | XWUIQRCode Component QR code display Simplified version using canvas |
| XWUIRadioGroup | XWUIRadioGroup Component Radio button group with horizontal/vertical layouts |
| XWUIRangeSlider | XWUIRangeSlider Component Dual-thumb slider for range selection Wraps XWUISlider with range mode ena |
| XWUIRating | XWUIRating Component Star/icon rating input |
| XWUIReactionSelector | XWUIReactionSelector Component Emoji reaction selector with popover |
| XWUIRecurrencePicker | XWUIRecurrencePicker Component Configure recurring task patterns (daily, weekly, monthly, yearly, cu |
| XWUIResizable | XWUIResizable Component Resizable container component |
| XWUIResizablePanel | XWUIResizablePanel Component Split-panel with two resizable panes and a draggable divider |
| XWUIResourceAllocationChart | XWUIResourceAllocationChart Component Visual resource allocation and capacity planning chart |
| XWUIResult | XWUIResult Component Result page/section with icons for success, error, info, warning |
| XWUIRichTextEditor | XWUIRichTextEditor Component Rich text/WYSIWYG editor Simplified version using contenteditable |
| XWUIScriptEditor | XWUIScriptEditor Component Multi-editor code editor component supporting multiple editor engines Use |
| XWUIScrollArea | XWUIScrollArea Component Custom scrollable area |
| XWUIScrollTo | XWUIScrollTo Component Smooth scroll to target element |
| XWUISectionGrouping | XWUISectionGrouping Component Group tasks/projects into sections in board and list views |
| XWUISegmentedControl | XWUISegmentedControl Component Segmented button control (single selection) |
| XWUISelect | XWUISelect Component Dropdown select with single and multi-select modes |
| XWUISeparator | XWUISeparator Component Visual separator/divider component |
| XWUISidebar | XWUISidebar Component Sidebar navigation component |
| XWUISignaturePad | XWUISignaturePad Component Canvas-based signature pad for drawing signatures |
| XWUISkeleton | XWUISkeleton Component Loading skeleton placeholder |
| XWUISkipLink | XWUISkipLink Component Accessibility skip navigation link |
| XWUISlider | XWUISlider Component - Production Quality High-performance slider with MUI-like features and 100% st |
| XWUISortableList | XWUISortableList Component Drag-and-drop sortable list with HTML5 drag API |
| XWUISpace | XWUISpace Component Add spacing between elements |
| XWUISpeedDial | XWUISpeedDial Component Floating action button with expandable menu |
| XWUISpinner | XWUISpinner Component Loading spinner with overlay option |
| XWUISplitButton | XWUISplitButton Component Button with main action and dropdown arrow for secondary actions |
| XWUISpoiler | XWUISpoiler Component Collapsible content with "show more" toggle |
| XWUISpreadsheet | XWUISpreadsheet Component Excel-like spreadsheet with formulas, formatting, and editing |
| XWUIStack | XWUIStack Component Stack layout (vertical flex with spacing) |
| XWUIStatistic | XWUIStatistic Component Display statistics/counts |
| XWUISteps | XWUISteps Component Step progress indicator (Stepper) |
| XWUIStickersOverlay | XWUIStickersOverlay Component Sticker picker and overlay for adding stickers to canvas |
| XWUIStyle | XWUIStyle Component Automatically loads and applies theme CSS files based on configuration Uses styl |
| XWUIStyleSelector | XWUIStyleSelector Component Dynamically generates form fields based on styles |
| XWUISubtaskExpander | XWUISubtaskExpander Component Inline expandable subtasks in table/grid views |
| XWUISwitch | XWUISwitch Component Toggle switch component |
| XWUITable | XWUITable Component Data table with sorting, filtering, and selection |
| XWUITabs | XWUITabs Component Tab navigation with various variants |
| XWUITaskTemplateSelector | XWUITaskTemplateSelector Component Select and apply task/project templates |
| XWUITester | XWUITester Component Base tester component for all XWUI component testers |
| XWUITextarea | XWUITextarea Component Multi-line text input with auto-resize option |
| XWUITextOverlay | XWUITextOverlay Component Text overlay for adding text to canvas with formatting options |
| XWUIThread | XWUIThread Component Scrollable message thread with multiple message bubbles |
| XWUITimeline | XWUITimeline Component - Production Quality High-performance timeline with MUI-like features and 100 |
| XWUITimelineZoom | XWUITimelineZoom Component Zoom controls for timeline views (day/week/month/year) |
| XWUITimePicker | XWUITimePicker Component Time selection component (12h/24h formats) |
| XWUITimeTracker | XWUITimeTracker Component Start/stop timer with time logging and manual entry |
| XWUIToast | XWUIToast Component Toast notification system |
| XWUIToggleGroup | XWUIToggleGroup Component Group of toggle buttons |
| XWUITooltip | XWUITooltip Component Hover tooltip with placement options |
| XWUITour | XWUITour Component Step-by-step guide/tour |
| XWUITransferList | XWUITransferList Component Double-list component to move items between "Source" and "Target" Used fo |
| XWUITransition | XWUITransition Component Animation wrapper component for enter/exit transitions Supports fade, slide |
| XWUITree | XWUITree Component Tree structure display with expand/collapse and selection |
| XWUITreeSelect | XWUITreeSelect Component Tree select dropdown Combines Tree + Select functionality |
| XWUITypingIndicator | XWUITypingIndicator Component Animated typing indicator showing "User is typing |
| XWUITypography | XWUITypography Component Typography/text component with variants |
| XWUIUpload | XWUIUpload Component File upload component with drag-and-drop |
| XWUIVideoEditor | XWUIVideoEditor Component Video editor with basic editing tools Reuses: XWUIVideoPlayer, XWUIButton, |
| XWUIVideoPlayer | XWUIVideoPlayer Component Video player with controls using native HTML5 video Reuses: XWUIButton, XW |
| XWUIVideoRecorder | XWUIVideoRecorder Component Video recorder using MediaRecorder API Reuses: XWUIButton, XWUIProgress, |
| XWUIVisuallyHidden | XWUIVisuallyHidden Component Hide content visually while keeping it accessible to screen readers Fol |
| XWUIWatermark | XWUIWatermark Component Watermark overlay |
| XWUIWorkflow | XWUIWorkflow Component Interactive workflow visualization component with nodes and connections |
| XWUIWorkloadView | XWUIWorkloadView Component Resource allocation view showing tasks per person and capacity |

---

*Generated on 2025-12-01T22:19:20.444Z*
