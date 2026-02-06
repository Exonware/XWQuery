## Top UI Frameworks & Component Catalogs (2025)

This document summarizes several **widely used UI frameworks / component libraries as of 2025** and gives a **component catalog** for each.  

> Note: Frameworks evolve quickly; this is a practical, reasonably complete list of commonly used components, not a guarantee of every experimental or legacy API.

---

## 1. Bootstrap 5/5.x

**Website**: `https://getbootstrap.com`  
**Type**: CSS framework + JS plugins (framework-agnostic)

### Download & Installation
- **CDN**: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css` (CSS)  
  `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js` (JS)
- **npm**: `npm install bootstrap`
- **yarn**: `yarn add bootstrap`
- **Download**: `https://getbootstrap.com/docs/5.3/getting-started/download/`
- **GitHub**: `https://github.com/twbs/bootstrap`
- **Bootstrap Icons**: `npm install bootstrap-icons` or `https://icons.getbootstrap.com/#install`  

### 1.1 Layout & Grid
- **Containers**: `container`, `container-fluid`, responsive containers (`container-sm` / `md` / `lg` / `xl` / `xxl`)
- **Grid**: rows, columns (`row`, `col`, `col-*`, `col-sm-*`, etc.), gutters
- **Column utilities**: offset, order, column wrapping
- **Responsive utilities**: display, visibility, spacing, flex utilities

### 1.2 Content & Typography
- **Reboot / Normalize**
- **Headings & display headings**
- **Lead text**
- **Inline text elements** (bold, italic, mark, code, etc.)
- **Lists**: unstyled, inline, description lists
- **Images**: responsive images, thumbnails, figures
- **Tables**: basic, striped, bordered, hover, responsive

### 1.3 Forms
- **Form layout**: stacked, horizontal, inline
- **Form controls**:
  - Text inputs (text, email, password, etc.)
  - Textarea
  - Select (single, multiple)
  - Checkboxes
  - Radio buttons
  - Switches
  - Range slider
  - File input
  - Floating labels
- **Validation states**: valid / invalid feedback

### 1.4 Components
- **Alerts**
- **Badges**
- **Breadcrumbs**
- **Buttons**
- **Button group**
- **Cards**
- **Carousel**
- **Close button**
- **Collapse**
- **Dropdowns**
- **List group**
- **Modal**
- **Navs & tabs**
- **Navbar**
- **Offcanvas**
- **Pagination**
- **Placeholders**
- **Popovers**
- **Progress**
- **Scrollspy**
- **Spinners**
- **Toasts**
- **Tooltips**

### 1.5 Helpers & Utilities
- **Colors, backgrounds, borders**
- **Spacing, sizing**
- **Flex, float, position utilities**
- **Text, font, alignment**
- **Visibility & overflow**

### 1.6 Icons
- **Bootstrap Icons**: Comprehensive icon library with 2,000+ icons
  - Website: [https://icons.getbootstrap.com](https://icons.getbootstrap.com)
  - SVG-based icons, available as font icons or SVG
  - Categories: arrows, UI, social, communication, etc.
  - Can be used standalone or integrated with Bootstrap components

---

## 2. Tailwind CSS 3.x (Utility-First)

**Website**: `https://tailwindcss.com`  
**Type**: Utility-first CSS framework (no pre-built "components" by default)

### Download & Installation
- **npm**: `npm install -D tailwindcss`
- **CDN**: `https://cdn.tailwindcss.com` (for development only)
- **CLI**: `npx tailwindcss init`
- **Documentation**: `https://tailwindcss.com/docs/installation`
- **GitHub**: `https://github.com/tailwindlabs/tailwindcss`
- **Heroicons** (recommended): `npm install @heroicons/react` or `https://heroicons.com/`  

Tailwind ships **utilities instead of components**. Commonly used categories:

### 2.1 Layout & Box Model Utilities
- **Display**: `block`, `inline`, `flex`, `grid`, `inline-flex`, `hidden`, etc.
- **Position**: `static`, `relative`, `absolute`, `fixed`, `sticky`
- **Top/Right/Bottom/Left / Inset**
- **Z-index**
- **Margin & padding** (responsive)
- **Width & height** (including `min-*`, `max-*`)
- **Overflow**

### 2.2 Flexbox & Grid
- **Flex**: direction, wrap, grow, shrink, basis, gap
- **Alignment**: justify, items, content, self
- **Grid**: template columns/rows, gap, auto-flow, spans

### 2.3 Typography & Color
- **Font family, size, weight**
- **Line height, letter spacing**
- **Text color, background color, gradient utilities**
- **Text alignment, decoration, transform**

### 2.4 Borders, Effects, Transitions
- **Borders**: width, color, radius
- **Shadows**
- **Opacity**
- **Filters & backdrop filters**
- **Transitions & animation utilities**

### 2.5 Interactivity & States
- **Hover / focus / active / disabled / group / peer states**
- **Responsive variants** for all utilities

### 2.6 Icons
- **No built-in icon library**; commonly paired with external icon sets:
  - **Heroicons**: Official Tailwind icon set - [https://heroicons.com](https://heroicons.com) - outline and solid variants
  - **Lucide Icons**: Popular open-source icon library - [https://lucide.dev](https://lucide.dev)
  - **Font Awesome**: Widely used icon font library - [https://fontawesome.com](https://fontawesome.com)
  - **Tabler Icons**: Free SVG icon library - [https://tabler.io/icons](https://tabler.io/icons)

> Component libraries like **Tailwind UI**, **DaisyUI**, **Flowbite**, **Headless UI**, and **Shadcn UI** are often used with Tailwind to provide concrete components.

---

## 3. Material UI (MUI) for React

**Website**: `https://mui.com`  
**Type**: React component library implementing Material Design

### Download & Installation
- **npm**: `npm install @mui/material @emotion/react @emotion/styled`
- **yarn**: `yarn add @mui/material @emotion/react @emotion/styled`
- **Material Icons**: `npm install @mui/icons-material`
- **Documentation**: `https://mui.com/material-ui/getting-started/installation/`
- **GitHub**: `https://github.com/mui/material-ui`
- **Playground**: `https://mui.com/material-ui/getting-started/usage/`  

### 3.1 Layout & Structure
- **Box**
- **Container**
- **Grid**
- **Stack**
- **Image List**
- **Masonry**
- **Paper**

### 3.2 Navigation
- **App Bar**
- **Toolbar**
- **Drawer**
- **Bottom Navigation**
- **Tabs**
- **Breadcrumbs**
- **Link**
- **Pagination**
- **Speed Dial**
- **Stepper** (horizontal, vertical, mobile)

### 3.3 Inputs & Controls
- **Button** (text, contained, outlined, icon, FAB, loading button)
- **Button Group**
- **Checkbox**
- **Radio**
- **Switch**
- **Rating**
- **Select**
- **Slider**
- **Text Field** (standard, filled, outlined)
- **Autocomplete**
- **Toggle Button / Toggle Button Group**
- **Transfer List**
- **Upload button (patterns with `Button` + `input`)**

### 3.4 Data Display
- **Avatar**
- **Badge**
- **Chip**
- **Divider**
- **Icons** (Material Icons integration)
- **List**
- **Table** (basic, sticky header, pagination, sorting, virtualization patterns)
- **Tooltip**
- **Typography**

### 3.9 Icons
- **Material Icons**: Comprehensive icon library with 2,000+ icons
  - Website: [https://mui.com/material-ui/material-icons/](https://mui.com/material-ui/material-icons/)
  - Based on Google's Material Design icon set
  - Available as React components (`@mui/icons-material`)
  - Categories: action, alert, av, communication, content, device, editor, file, hardware, image, maps, navigation, notification, places, social, toggle, etc.
  - Supports filled, outlined, rounded, sharp, and two-tone styles

### 3.5 Feedback
- **Alert**
- **Backdrop**
- **Dialog**
- **Progress** (linear, circular)
- **Skeleton**
- **Snackbar**

### 3.6 Surfaces
- **Accordion**
- **Card**
- **Paper**
- **App Bar**

### 3.7 Date / Time & Pickers (MUI X)
- **Date Picker**
- **Date Time Picker**
- **Time Picker**
- **Date Range Picker**

### 3.8 Data Grid (MUI X)
- **DataGrid / DataGridPro / DataGridPremium**
  - Columns, sorting, filtering, grouping, pinning
  - Pagination, virtualization
  - Editing, row selection

---

## 4. Ant Design (AntD) for React

**Website**: `https://ant.design`  
**Type**: Enterprise React UI library

### Download & Installation
- **npm**: `npm install antd`
- **yarn**: `yarn add antd`
- **pnpm**: `pnpm add antd`
- **CDN**: `https://cdn.jsdelivr.net/npm/antd@5/dist/reset.css` (CSS)  
  `https://cdn.jsdelivr.net/npm/antd@5/dist/antd.min.js` (JS)
- **Ant Design Icons**: `npm install @ant-design/icons`
- **Documentation**: `https://ant.design/docs/react/getting-started`
- **GitHub**: `https://github.com/ant-design/ant-design`  

### 4.1 General
- **Button**
- **Icon** (Ant Design Icons integration)
- **Typography**

### 4.8 Icons
- **Ant Design Icons**: Comprehensive icon library
  - Website: [https://ant.design/components/icon/](https://ant.design/components/icon/)
  - Separate package: `@ant-design/icons`
  - 700+ icons organized by categories
  - Categories: direction, suggestion, edit, data, web app, logo, etc.
  - Available as React components with consistent API

### 4.2 Layout
- **Divider**
- **Grid** (`Row`, `Col`)
- **Layout** (`Layout`, `Header`, `Sider`, `Content`, `Footer`)
- **Space**

### 4.3 Navigation
- **Affix**
- **Breadcrumb**
- **Dropdown**
- **Menu**
- **PageHeader** (or `PageHeader` pattern)
- **Pagination**
- **Steps**
- **Tabs**

### 4.4 Data Entry
- **AutoComplete**
- **Cascader**
- **Checkbox**
- **DatePicker / RangePicker**
- **Form**
- **Input / InputNumber / Password**
- **Mentions**
- **Radio**
- **Rate**
- **Select**
- **Slider**
- **Switch**
- **TimePicker**
- **Transfer**
- **TreeSelect**
- **Upload**

### 4.5 Data Display
- **Avatar**
- **Badge**
- **Calendar**
- **Card**
- **Carousel**
- **Collapse**
- **Comment**
- **Descriptions**
- **Empty**
- **Image**
- **List**
- **Popover**
- **Statistic**
- **Table**
- **Tag**
- **Timeline**
- **Tooltip**
- **Tree**

### 4.6 Feedback
- **Alert**
- **Drawer**
- **Message**
- **Modal**
- **Notification**
- **Popconfirm**
- **Progress**
- **Result**
- **Skeleton**
- **Spin**

### 4.7 Other
- **Anchor**
- **BackTop**
- **ConfigProvider**

---

## 5. Chakra UI for React

**Website**: `https://chakra-ui.com`  
**Type**: Accessible, themeable React component library (often paired with Tailwind or alone)

### Download & Installation
- **npm**: `npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion`
- **yarn**: `yarn add @chakra-ui/react @emotion/react @emotion/styled framer-motion`
- **Chakra Icons**: `npm install @chakra-ui/icons`
- **Documentation**: `https://chakra-ui.com/getting-started`
- **GitHub**: `https://github.com/chakra-ui/chakra-ui`
- **Create Chakra App**: `npx create-chakra-app@latest`  

### 5.1 Layout
- **Box**
- **Center / Square / Circle**
- **Container**
- **Flex**
- **Grid / SimpleGrid**
- **Stack / HStack / VStack / Wrap**
- **Spacer**
- **AspectRatio**

### 5.2 Forms & Inputs
- **Button / IconButton**
- **Checkbox / CheckboxGroup**
- **Editable**
- **FormControl / FormLabel / FormHelperText / FormErrorMessage**
- **Input / InputGroup / InputLeftAddon / InputRightAddon / InputLeftElement / InputRightElement**
- **NumberInput**
- **PinInput**
- **Radio / RadioGroup**
- **Select**
- **Slider**
- **Switch**
- **Textarea**

### 5.3 Data Display
- **Badge**
- **Code**
- **Divider**
- **Kbd**
- **List / ListItem / ListIcon**
- **Stat**
- **Table**
- **Tag**
- **Text**
- **Heading**

### 5.4 Feedback
- **Alert**
- **CircularProgress / Progress**
- **Skeleton**
- **Spinner**
- **Toast (hook-based)**

### 5.5 Overlay & Navigation
- **AlertDialog**
- **Drawer**
- **Menu**
- **Modal**
- **Popover**
- **Tooltip**

### 5.6 Media & Misc
- **Avatar**
- **Icon** (supports multiple icon libraries)
- **Image**
- **Portal**
- **Transitions & motion helpers (via Framer Motion integration)**

### 5.7 Icons
- **Chakra UI Icons**: Icon library integration
  - Website: [https://chakra-ui.com/docs/media-and-icons/icon](https://chakra-ui.com/docs/media-and-icons/icon)
  - Package: `@chakra-ui/icons` (includes common icons)
  - Also supports external icon libraries:
    - **React Icons**: Popular icon library aggregator - [https://react-icons.github.io/react-icons/](https://react-icons.github.io/react-icons/)
    - **Heroicons**: Can be integrated via `@chakra-ui/icons` or directly - [https://heroicons.com](https://heroicons.com)
    - **Feather Icons**: Lightweight icon set - [https://feathericons.com](https://feathericons.com)
  - Flexible icon system that works with any SVG icon library

---

## 6. Shadcn UI (with Tailwind & Radix)

**Website**: `https://ui.shadcn.com`  
**Type**: Copy-paste component collection built on **Radix UI** + **Tailwind**

### Download & Installation
- **CLI**: `npx shadcn-ui@latest init` (for new projects)
- **Add components**: `npx shadcn-ui@latest add [component-name]`
- **Documentation**: `https://ui.shadcn.com/docs/installation`
- **GitHub**: `https://github.com/shadcn-ui/ui`
- **Prerequisites**: Requires React, Tailwind CSS, and TypeScript
- **Lucide React Icons** (recommended): `npm install lucide-react`  

### 6.1 Layout & Structure
- **Accordion**
- **Aspect Ratio**
- **Card**
- **Collapsible**
- **Dialog**
- **Drawer**
- **Scroll Area**
- **Separator**
- **Sheet**
- **Tabs**

### 6.2 Forms & Inputs
- **Button**
- **Checkbox**
- **Combobox**
- **Command Palette**
- **Date Picker**
- **Form primitives**
- **Input**
- **Label**
- **Menubar**
- **Radio Group**
- **Select**
- **Slider**
- **Switch**
- **Textarea**
- **Toggle / Toggle Group**

### 6.3 Data Display & Feedback
- **Alert**
- **Alert Dialog**
- **Badge**
- **Hover Card**
- **Popover**
- **Progress**
- **Skeleton**
- **Sonner / Toast** (notification pattern)
- **Tooltip**

### 6.4 Navigation
- **Breadcrumb**
- **Navigation Menu**
- **Pagination**
- **Tabs**

### 6.5 Icons
- **No built-in icon library**; commonly used with external icon sets:
  - **Lucide React**: Recommended icon library (`lucide-react`) - 1,000+ icons - [https://lucide.dev](https://lucide.dev)
  - **Heroicons**: Popular choice for React projects - [https://heroicons.com](https://heroicons.com)
  - **Radix Icons**: Icons from the Radix UI team - [https://www.radix-ui.com/icons](https://www.radix-ui.com/icons)
  - **React Icons**: Aggregator for multiple icon libraries - [https://react-icons.github.io/react-icons/](https://react-icons.github.io/react-icons/)
  - Icons are typically integrated as separate components alongside Shadcn UI components

> The exact catalog changes as new components are added; refer to the official site for the latest list.

---

## 7. Prime UI (PrimeReact / PrimeVue / PrimeNG – representative catalog)

**Website**: `https://primetek.com.tr` / `https://primereact.org` / `https://primevue.org` / `https://primefaces.org/primeng`  
**Type**: Rich UI suite for multiple frameworks (React, Vue, Angular, etc.)

### Download & Installation

**PrimeReact** (React):
- **npm**: `npm install primereact primeicons`
- **yarn**: `yarn add primereact primeicons`
- **Documentation**: `https://primereact.org/installation`
- **GitHub**: `https://github.com/primefaces/primereact`

**PrimeVue** (Vue):
- **npm**: `npm install primevue primeicons`
- **yarn**: `yarn add primevue primeicons`
- **Documentation**: `https://primevue.org/installation`
- **GitHub**: `https://github.com/primefaces/primevue`

**PrimeNG** (Angular):
- **npm**: `npm install primeng primeicons`
- **yarn**: `yarn add primeng primeicons`
- **Documentation**: `https://primeng.org/setup`
- **GitHub**: `https://github.com/primefaces/primeng`

**PrimeIcons** (all variants): `https://www.primefaces.org/primeicons/`  

Below is a **representative** catalog taking **PrimeReact** as the baseline; other Prime variants are similar.

### 7.1 Form & Input Components
- **AutoComplete**
- **Calendar / DatePicker**
- **CascadeSelect**
- **Checkbox**
- **Chips**
- **ColorPicker**
- **Dropdown**
- **InputMask**
- **InputNumber**
- **InputSwitch**
- **InputText**
- **Knob**
- **ListBox**
- **MultiSelect**
- **Password**
- **RadioButton**
- **Rating**
- **Slider**
- **Textarea**
- **ToggleButton**
- **TriStateCheckbox**

### 7.2 Button & Menu Components
- **Button**
- **SplitButton**
- **SpeedDial**
- **Menu**
- **Menubar**
- **MegaMenu**
- **PanelMenu**
- **ContextMenu**
- **Breadcrumb**
- **Dock**
- **Steps**
- **TabMenu**
- **TieredMenu**

### 7.3 Data Components
- **DataTable**
- **TreeTable**
- **DataView**
- **Timeline**
- **OrganizationChart**
- **OrderList**
- **PickList**
- **Tree**
- **VirtualScroller**

### 7.4 Panel & Overlay Components
- **Accordion**
- **Card**
- **DeferredContent**
- **Divider**
- **Fieldset**
- **Panel**
- **Splitter**
- **TabView**
- **Toolbar**
- **ConfirmDialog**
- **Dialog**
- **DynamicDialog**
- **OverlayPanel**
- **Sidebar**
- **Tooltip**

### 7.5 File & Media
- **FileUpload**
- **Galleria**
- **Image**

### 7.6 Messages & Misc
- **Message**
- **Toast**
- **BlockUI**
- **Inplace**
- **ScrollTop**
- **Skeleton**
- **Tag**
- **Badge**
- **Chip**
- **Avatar**

### 7.7 Icons
- **PrimeIcons**: Comprehensive icon library
  - Website: [https://www.primefaces.org/primeicons/](https://www.primefaces.org/primeicons/)
  - 280+ icons designed for Prime UI components
  - Available as font icons (CSS classes) or SVG
  - Categories: arrows, business, charts, communication, currency, devices, editor, file, finance, food, general, healthcare, media, medical, objects, payment, people, shopping, social, technology, text editor, travel, weather, etc.
  - Consistent with Prime UI design language

---

## 8. UIKit (Front-End Framework)

**Website**: `https://getuikit.com`  
**Type**: Modular front-end framework (CSS + JS)

### Download & Installation
- **CDN**: `https://cdn.jsdelivr.net/npm/uikit@3.17.11/dist/css/uikit.min.css` (CSS)  
  `https://cdn.jsdelivr.net/npm/uikit@3.17.11/dist/js/uikit.min.js` (JS)
- **npm**: `npm install uikit`
- **yarn**: `yarn add uikit`
- **Download**: `https://getuikit.com/docs/installation`
- **GitHub**: `https://github.com/uikit/uikit`
- **Package Manager**: Available via npm, yarn, Composer, NuGet  

### 8.1 Layout & Grid
- **Container**
- **Grid**
- **Flex**
- **Column & Width utilities**

### 8.2 Navigation
- **Navbar**
- **Nav**
- **Subnav**
- **Breadcrumb**
- **Pagination**
- **Tab**

### 8.3 Elements & Components
- **Alert**
- **Badge**
- **Button**
- **Card**
- **Dropdown**
- **Form**
- **Icon**
- **Label**
- **List**
- **Marker**
- **Modal**
- **Notification**
- **Off-canvas**
- **Overlay**
- **Progress**
- **Spinner**
- **Switcher**
- **Tooltip**

### 8.5 Icons
- **UIKit Icon Component**: Icon system with built-in icon set
  - Website: [https://getuikit.com/docs/icon](https://getuikit.com/docs/icon)
  - Includes a collection of commonly used icons
  - Supports icon fonts (Feather, Font Awesome, etc.) via configuration
  - Can use SVG icons or icon fonts
  - Icon component with consistent styling and sizing options

### 8.4 Media & Misc
- **Accordion**
- **Cover**
- **Grid & Masonry-like features**
- **Lightbox**
- **Parallax**
- **Slideshow**
- **Slider**

---

## 9. Icon Collections Summary

| Framework / Library | Built-in Icon Library | Icon Library Name / Details                                    | Icon Count (Approx.) |
| ------------------- | --------------------- | -------------------------------------------------------------- | -------------------- |
| Bootstrap           | ✅ Yes                | **[Bootstrap Icons](https://icons.getbootstrap.com)**          | 2,000+               |
| MUI                 | ✅ Yes                | **[Material Icons](https://mui.com/material-ui/material-icons/)** | 2,000+               |
| Ant Design          | ✅ Yes                | **[Ant Design Icons](https://ant.design/components/icon/)**     | 700+                 |
| Chakra UI           | ✅ Yes (flexible)     | **[Chakra Icons](https://chakra-ui.com/docs/media-and-icons/icon)** + external support | Varies               |
| Prime UI            | ✅ Yes                | **[PrimeIcons](https://www.primefaces.org/primeicons/)**       | 280+                 |
| UIKit               | ✅ Yes                | **[UIKit Icon Component](https://getuikit.com/docs/icon)**     | Varies               |
| Tailwind CSS        | ❌ No                 | Commonly paired with **[Heroicons](https://heroicons.com)** or **[Lucide Icons](https://lucide.dev)** | N/A                  |
| Shadcn UI           | ❌ No                 | Commonly paired with **[Lucide React](https://lucide.dev)** or **[Heroicons](https://heroicons.com)** | N/A                  |

---

## 10. Quick Comparison (Very High-Level)

| Framework / Library | Primary Ecosystem    | Style Model                 | Typical Use Case                                      |
| ------------------- | -------------------- | --------------------------- | ----------------------------------------------------- |
| Bootstrap           | Any (HTML/CSS/JS)    | CSS components + JS        | Classic responsive sites, dashboards, admin panels    |
| Tailwind CSS        | Any (HTML/CSS/JS)    | Utility-first CSS          | Highly custom UIs, design systems, modern SPAs        |
| MUI                 | React                | Material Design components | React apps needing Material Design & rich components  |
| Ant Design          | React                | Enterprise UI kit          | Enterprise dashboards, admin & internal tools         |
| Chakra UI           | React                | Themeable, accessible      | Accessible React apps, design systems                 |
| Shadcn UI           | React + Tailwind     | Headless + styled pieces   | Modern, "app-like" UIs with fine-grained control      |
| Prime (React/Vue/NG)| React/Vue/Angular    | Large widget suite         | Feature-heavy business apps & data-intensive UIs      |
| UIKit               | Any (HTML/CSS/JS)    | Modular framework          | Lightweight, modern sites with modular JS components  |

---

## 11. Notes for Evaluation & Adoption

- **Ecosystem alignment**: prefer React-specific frameworks (MUI, AntD, Chakra, Shadcn, PrimeReact) for React projects; Tailwind pairs well with most of them.
- **Design language**: Material Design (MUI), Ant Design, or neutral (Chakra, Shadcn, Tailwind-only).
- **Complex data-heavy apps**: Ant Design, MUI (with DataGrid), and PrimeReact/PrimeNG are particularly strong.
- **Accessibility**: Chakra, Shadcn (Radix), and modern MUI focus heavily on a11y.
- **Icon requirements**: If you need a comprehensive built-in icon library, Bootstrap Icons, Material Icons, and Ant Design Icons offer the largest collections. For Tailwind/Shadcn projects, Heroicons or Lucide React are popular choices.


