/* ---------------------------------------------------------------
 * Type declarations for non-TS asset imports.
 *
 * TypeScript 6 requires explicit declarations for side-effect
 * imports of non-TypeScript files (e.g. `import "./globals.css"`).
 *
 * Next.js ships declarations for CSS Modules (`*.module.css`) but
 * NOT for plain CSS files imported for their side effects.
 * --------------------------------------------------------------- */

declare module "*.css" {}
declare module "*.scss" {}
declare module "*.sass" {}
