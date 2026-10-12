// `?raw` imports (Vite): the file's contents as a string. The logo reads its SVG this way.
declare module "*?raw" {
  const content: string;
  export default content;
}
