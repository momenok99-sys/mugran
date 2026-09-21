# MUGRAN Custom Fonts Directory

To self-host **Aeonik TRIAL**, drop your font files into this directory:
- `AeonikTRIAL-Regular.woff2` (or `.otf` / `.ttf`)
- `AeonikTRIAL-Medium.woff2` (or `.otf` / `.ttf`)
- `AeonikTRIAL-Bold.woff2` (or `.otf` / `.ttf`)
- `AeonikTRIAL-Black.woff2` (or `.otf` / `.ttf`)

The `@font-face` configuration in `app/globals.css` will automatically resolve both:
1. Locally installed fonts on your system (`local('Aeonik TRIAL')`).
2. Webfont files placed directly in this `/public/fonts/` folder.
