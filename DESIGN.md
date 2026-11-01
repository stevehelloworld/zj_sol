# Design

## Visual theme

紙劇場教室。白底承載圖解，深堇紫是標題與舞台，金盞花是「看這裡」。紅綠燈的綠／紅、大樓的黏土色只出現在題目模型裡。

## Color

Strategy: committed violet + marigold accent on pure white.

```css
--bg: oklch(1 0 0);
--surface: oklch(0.965 0.012 294);
--ink: oklch(0.22 0.045 294);
--muted: oklch(0.45 0.03 294);
--primary: oklch(0.38 0.14 294);
--accent: oklch(0.72 0.15 85);
--green: oklch(0.62 0.16 145);
--red: oklch(0.58 0.19 25);
```

## Typography

- Display: Huninn, fallback Noto Sans TC
- Body: Noto Sans TC
- Code: Martian Mono

## Layout

Home is a searchable 題本: underline finder, unit filters, illustrated stamps, then a textbook table of contents that can hold hundreds of problems. Lessons are a theater: diagram stage above, teacher voice below, chapter rail on the side at desktop.

## Motion

Lesson animations are the product. UI chrome stays quiet (200–300ms). Respect `prefers-reduced-motion`.
