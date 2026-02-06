# International Typography Support

This typography system now provides comprehensive support for international text, including RTL/LTR languages, Arabic, CJK (Chinese, Japanese, Korean), and UTF-8 encoding.

## Features

### ✅ UTF-8 Support
- All CSS files include `@charset "UTF-8"` declaration
- Proper encoding for all Unicode characters
- Support for emoji, symbols, and special characters

### ✅ RTL/LTR Direction Support
- Automatic direction detection via `[dir]` attribute
- CSS custom properties for directional styling
- Utility classes for start/end alignment and spacing

### ✅ Arabic & Persian (Farsi) Support
- Comprehensive Arabic font fallbacks
- RTL direction support
- Optimized line heights and letter spacing
- Font feature settings for Arabic ligatures

### ✅ Hebrew Support
- Hebrew font fallbacks
- RTL direction support
- Proper text rendering for Hebrew scripts

### ✅ CJK Support (Chinese, Japanese, Korean)
- Chinese (Simplified & Traditional) font stacks
- Japanese font stacks with proper fallbacks
- Korean font stacks
- Optimized word breaking and line heights

### ✅ Additional Scripts
- Thai
- Devanagari (Hindi, Sanskrit)
- Cyrillic (Russian, Ukrainian, etc.)
- Greek
- Vietnamese

## Usage

### Basic Setup

Include the international typography CSS in your HTML:

```html
<link rel="stylesheet" href="styles/base/typography.css">
<link rel="stylesheet" href="styles/base/typography-international.css">
```

### Setting Language

Use the `lang` attribute on HTML elements:

```html
<html lang="ar">  <!-- Arabic -->
<html lang="zh-CN">  <!-- Chinese Simplified -->
<html lang="ja">  <!-- Japanese -->
<html lang="ko">  <!-- Korean -->
<html lang="he">  <!-- Hebrew -->
```

### Setting Direction

Use the `dir` attribute:

```html
<html dir="rtl">  <!-- Right-to-left -->
<html dir="ltr">  <!-- Left-to-right (default) -->
<html dir="auto">  <!-- Auto-detect from content -->
```

### Font Families

All font family CSS files now include international fallbacks. The system automatically selects appropriate fonts based on:

1. The primary font (e.g., 'Inter', 'Roboto')
2. Language-specific fallbacks (Arabic, Hebrew, CJK, etc.)
3. System fonts as final fallback

Example:
```css
:root[data-font="inter"] {
    --font-family-base: 'Inter',
                        /* Arabic & Persian */
                        'Segoe UI', 'Arabic UI Display', 'Tahoma', 'Noto Sans Arabic',
                        /* Hebrew */
                        'Hebrew UI Display', 'David', 'Noto Sans Hebrew',
                        /* Chinese */
                        'Microsoft YaHei', 'SimHei', 'PingFang SC', 'Noto Sans SC',
                        /* Japanese */
                        'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', 'Noto Sans JP',
                        /* Korean */
                        'Malgun Gothic', 'Nanum Gothic', 'Noto Sans KR',
                        /* System fallbacks */
                        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

### Directional Utilities

Use CSS custom properties for directional styling:

```css
.element {
    text-align: var(--text-align-start);  /* Left in LTR, Right in RTL */
    margin-left: var(--spacing);
}

/* Or use utility classes */
.text-start  /* Aligns to start (left in LTR, right in RTL) */
.text-end    /* Aligns to end (right in LTR, left in RTL) */
.margin-start
.margin-end
.padding-start
.padding-end
```

### Language-Specific Styling

The system automatically applies language-specific styles:

```css
/* Arabic text gets RTL direction and Arabic fonts */
[lang="ar"] {
    font-family: var(--font-family-arabic);
    direction: rtl;
    text-align: right;
}

/* CJK gets optimized line heights and word breaking */
[lang="zh"],
[lang="ja"],
[lang="ko"] {
    font-family: var(--font-family-chinese); /* or japanese/korean */
    line-height: 1.6;
    word-break: keep-all;
}
```

## Font Fallback Strategy

The typography system uses a smart fallback strategy:

1. **Primary Font**: The selected font (e.g., 'Inter', 'Roboto')
2. **Script-Specific Fonts**: Fonts optimized for specific scripts
   - Arabic: 'Segoe UI', 'Arabic UI Display', 'Tahoma', 'Noto Sans Arabic'
   - Hebrew: 'Hebrew UI Display', 'David', 'Noto Sans Hebrew'
   - Chinese: 'Microsoft YaHei', 'SimHei', 'PingFang SC', 'Noto Sans SC'
   - Japanese: 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', 'Noto Sans JP'
   - Korean: 'Malgun Gothic', 'Nanum Gothic', 'Noto Sans KR'
3. **System Fonts**: Platform-specific system fonts
4. **Generic Fallback**: Generic sans-serif

## Text Rendering Optimizations

### Font Smoothing
- `-webkit-font-smoothing: antialiased` for better rendering
- `-moz-osx-font-smoothing: grayscale` for macOS

### Font Features
- Ligatures enabled for better typography
- Kerning enabled for proper character spacing
- Contextual alternates for script-specific rendering

### Language-Specific Optimizations
- **Arabic/Hebrew**: Increased line height (1.8) for better readability
- **CJK**: Tighter line height (1.6) as characters are typically square
- **CJK**: `word-break: keep-all` for proper word breaking

## Unicode Range Support

The system includes `@font-face` declarations with Unicode ranges for:
- Arabic: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF
- Hebrew: U+0590-05FF, U+FB00-FB4F
- Chinese: U+4E00-9FFF, U+3400-4DBF, U+20000-2A6DF, U+2A700-2B73F
- Japanese: U+3040-309F, U+30A0-30FF, U+4E00-9FFF
- Korean: U+AC00-D7AF, U+1100-11FF, U+3130-318F

## Examples

### Arabic Text
```html
<html lang="ar" dir="rtl">
<body>
    <p>مرحبا بك في النظام</p>
</body>
</html>
```

### Mixed Content (LTR + RTL)
```html
<html lang="en" dir="ltr">
<body>
    <p>Hello <span lang="ar" dir="rtl">مرحبا</span> World</p>
</body>
</html>
```

### Chinese Text
```html
<html lang="zh-CN">
<body>
    <p>欢迎使用国际化排版系统</p>
</body>
</html>
```

### Japanese Text
```html
<html lang="ja">
<body>
    <p>国際化タイポグラフィシステムへようこそ</p>
</body>
</html>
```

## Browser Support

- Modern browsers with full Unicode support
- CSS custom properties (CSS Variables)
- `@font-face` with Unicode ranges
- `unicode-bidi` and `direction` properties
- Font feature settings

## Notes

- Ensure your HTML includes `<meta charset="UTF-8">` in the `<head>`
- Use appropriate `lang` and `dir` attributes for best results
- Font fallbacks ensure text is always readable, even if primary fonts aren't available
- The system gracefully degrades to system fonts if web fonts fail to load

