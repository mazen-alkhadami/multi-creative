# MULTI CREATIVES — Design System Specification

## 1. Brand Aesthetics & Tone

MULTI CREATIVES projects the authority, discretion, and technical mastery of an elite global creative technology partner.

- **Tone**: Understated luxury, architectural precision, technological foresight.
- **Rhythm**: Generous negative space, editorial typography, subtle metallic hairline borders.
- **Avoid**: Flashing neon, overly rounded cartoonish shapes, cluttered multi-color gradients, fake glassmorphic blur stacks.

---

## 2. Color Palette & Token System

### 2.1 Core Palette
```css
/* Core Palette Values */
--color-matte-black: #111111;
--color-charcoal: #1C1C1C;
--color-champagne-gold: #C6A66B;
--color-gold-hover: #D8BC84;
--color-gold-muted: rgba(198, 166, 107, 0.15);
--color-warm-ivory: #F5F1E8;
--color-muted-gray: #99958D;
--color-charcoal-border: #2A2A2A;
--color-ivory-border: #E8E4DA;
```

### 2.2 Semantic Theme Mapping

#### Dark Theme (Default)
- **Background**: `#111111` (Matte Black)
- **Surface Level 1 (Cards, Menus)**: `#1C1C1C` (Charcoal)
- **Surface Level 2 (Elevated, Hover)**: `#252525`
- **Border Subtle**: `#2A2A2A`
- **Border Accent**: `#C6A66B` (Champagne Gold)
- **Text Primary**: `#F5F1E8` (Warm Ivory)
- **Text Secondary**: `#99958D` (Muted Gray)
- **Text Accent**: `#C6A66B` (Champagne Gold)

#### Light Theme
- **Background**: `#F5F1E8` (Warm Ivory)
- **Surface Level 1 (Cards, Menus)**: `#FFFFFF` (Crisp Studio White)
- **Surface Level 2 (Elevated, Hover)**: `#EDE9DF`
- **Border Subtle**: `#E2DDCF`
- **Border Accent**: `#C6A66B` (Champagne Gold)
- **Text Primary**: `#111111` (Matte Black)
- **Text Secondary**: `#6B6862` (Deep Charcoal Gray)
- **Text Accent**: `#A8884C` (Deepened Gold for contrast)

---

## 3. Typography Scale & Font Pairings

### 3.1 Font Families
- **Arabic (`ar`)**: `Cairo`, `sans-serif`
  - High legibility, modern geometric kufic balance, crisp arabic numerals.
- **English (`en`)**: `Plus Jakarta Sans`, `sans-serif`
  - Clean, high-fashion geometric neo-grotesque with sharp architectural terminals.

### 3.2 Type Scale
- **Display Hero**: `text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]`
- **Heading 1**: `text-3xl md:text-5xl font-bold tracking-tight leading-[1.2]`
- **Heading 2**: `text-2xl md:text-3xl font-semibold leading-[1.3]`
- **Heading 3**: `text-xl md:text-2xl font-medium leading-[1.4]`
- **Subheading / Lead**: `text-lg md:text-xl font-normal leading-relaxed text-muted`
- **Body Text**: `text-base font-normal leading-relaxed`
- **Caption / Metadata**: `text-xs md:text-sm font-medium tracking-wide uppercase`

---

## 4. Spacing, Containers & Grid

### 4.1 Layout Containers
- **Standard Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Editorial Narrow Container**: `max-w-4xl mx-auto px-4 sm:px-6`
- **Wide Showcase Container**: `max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12`

### 4.2 Vertical Rhythms
- **Section Spacing**: `py-20 md:py-32`
- **Component Gap**: `gap-6 md:gap-8`
- **Text Hierarchy Stack**: `space-y-4` or `space-y-6`

---

## 5. Component Standards

### 5.1 Buttons
1. **Primary Luxury Button**:
   - Background: Champagne Gold (`#C6A66B`)
   - Text: Matte Black (`#111111`) font-semibold
   - Hover: `#D8BC84`, subtle gold glow `shadow-[0_0_20px_rgba(198,166,107,0.25)]`
   - Radius: `rounded-full` or `rounded-lg` (uniform pill or architectural 8px)
2. **Secondary Outline Button**:
   - Border: 1px solid subtle border
   - Text: Foreground
   - Hover: Background surface elevation with border highlight
3. **Ghost Button**:
   - Transparent with text color hover and underline micro-movement

### 5.2 Cards
- Subtle border (`1px solid var(--border-subtle)`), background `var(--surface-primary)`.
- Hover interaction: Hairline gold border illumination (`border-champagne-gold/40`), subtle -2px Y-translation.

### 5.3 Form Controls
- Dark/Light responsive inputs with solid background, crisp label, clear placeholder in Muted Gray, and Champagne Gold focus ring (`ring-1 ring-[#C6A66B]`).

---

## 6. Motion & Interaction Standards

- **Transitions**: Default `duration-300 ease-out`.
- **Framer Motion Application**:
  - Fade-in & subtle slide-up (`y: 20` to `y: 0`, opacity `0` to `1`) on section entry.
  - Staggered child reveals (delay: `index * 0.08s`).
  - Mobile menu drawer smooth lateral transition.
- **Micro-haptics**: No jerky bounces or exaggerated rubber-banding.
