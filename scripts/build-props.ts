// Reads every component's props from its TypeScript types and writes site/playground/props.generated.json,
// which the docs' playground turns into one control per prop. A prop is included when the component
// declares it itself (its own props and cva variants), not when it's inherited from HTML or Base UI;
// `disabled` is kept as the one common inherited control.
//   string literal union -> select, boolean -> checkbox, number -> number, string / ReactNode -> text.
// Defaults come from destructuring defaults (`size = "icon"`) and cva `defaultVariants`.
// Usage: tsx scripts/build-props.ts
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import type * as TS from "typescript-api";

// The project compiles with TypeScript 7 (native), which has no JS compiler API; this reads types
// with TypeScript 6 (devDependency `typescript-api`), loaded as CommonJS.
const ts = createRequire(import.meta.url)("typescript-api") as typeof TS;

const ROOT = path.resolve(import.meta.dirname, "..");
const UI = path.join(ROOT, "registry/osrs/ui");
const OUT = path.join(ROOT, "site/playground/props.generated.json");
const KEEP_INHERITED = new Set(["disabled"]);

type Prop = {
  name: string;
  control: "select" | "boolean" | "number" | "text";
  options?: string[];
  default?: string | number | boolean;
  description?: string;
};

const files = fs
  .readdirSync(UI)
  .filter((f) => f.endsWith(".tsx") && !f.endsWith("-sprites.tsx") && f !== "skill-icons.tsx")
  .map((f) => path.join(UI, f));
const config = ts.parseJsonConfigFileContent(ts.readConfigFile(path.join(ROOT, "tsconfig.json"), ts.sys.readFile).config, ts.sys, ROOT);
const program = ts.createProgram(files, config.options);
const checker = program.getTypeChecker();

/** cva `defaultVariants` in a file, merged (good enough: one cva per component file). */
function cvaDefaults(sf: TS.SourceFile): Record<string, string> {
  const out: Record<string, string> = {};
  const visit = (n: TS.Node) => {
    if (ts.isPropertyAssignment(n) && n.name.getText(sf) === "defaultVariants" && ts.isObjectLiteralExpression(n.initializer)) {
      for (const p of n.initializer.properties)
        if (ts.isPropertyAssignment(p) && ts.isStringLiteral(p.initializer)) out[p.name.getText(sf).replace(/"/g, "")] = p.initializer.text;
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

/** Defaults written in the component's parameter destructuring. */
function paramDefaults(fn: TS.SignatureDeclaration, sf: TS.SourceFile): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  const p = fn.parameters[0];
  if (!p || !ts.isObjectBindingPattern(p.name)) return out;
  for (const el of p.name.elements) {
    if (!el.initializer) continue;
    const key = (el.propertyName ?? el.name).getText(sf);
    const i = el.initializer;
    if (ts.isStringLiteral(i)) out[key] = i.text;
    else if (ts.isNumericLiteral(i)) out[key] = Number(i.text);
    else if (i.kind === ts.SyntaxKind.TrueKeyword) out[key] = true;
    else if (i.kind === ts.SyntaxKind.FalseKeyword) out[key] = false;
  }
  return out;
}

function controlFor(type: TS.Type): Pick<Prop, "control" | "options"> | null {
  const parts = type.isUnion() ? type.types : [type];
  const real = parts.filter((t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)));
  if (real.length && real.every((t) => t.isStringLiteral())) return { control: "select", options: real.map((t) => (t as TS.StringLiteralType).value) };
  if (real.length && real.every((t) => t.flags & ts.TypeFlags.BooleanLiteral)) return { control: "boolean" };
  if (real.length === 1 && real[0].flags & ts.TypeFlags.Number) return { control: "number" };
  const text = checker.typeToString(type);
  if (real.length === 1 && real[0].flags & ts.TypeFlags.String) return { control: "text" };
  if (/ReactNode/.test(text)) return { control: "text" };
  return null;
}

const result: Record<string, Record<string, Prop[]>> = {};
for (const file of files) {
  const sf = program.getSourceFile(file)!;
  const defaults = cvaDefaults(sf);
  const moduleSym = checker.getSymbolAtLocation(sf);
  if (!moduleSym) continue;
  const comps: Record<string, Prop[]> = {};
  for (const exp of checker.getExportsOfModule(moduleSym)) {
    if (!/^[A-Z]/.test(exp.name)) continue;
    const sym = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp;
    const decl = sym.valueDeclaration;
    if (!decl || !(ts.isFunctionDeclaration(decl) || ts.isVariableDeclaration(decl))) continue;
    const fnType = checker.getTypeOfSymbolAtLocation(sym, decl);
    const sig = fnType.getCallSignatures()[0];
    if (!sig || !sig.parameters[0]) continue;
    const propsType = checker.getTypeOfSymbolAtLocation(sig.parameters[0], decl);
    const pd = ts.isFunctionDeclaration(decl) ? paramDefaults(decl, sf) : {};
    const props: Prop[] = [];
    for (const p of propsType.getProperties()) {
      const decls = p.declarations ?? [];
      const own = decls.some((d) => d.getSourceFile().fileName.startsWith(UI));
      const fromCva = decls.some((d) => d.getSourceFile().fileName.includes("class-variance-authority"));
      if (!own && !fromCva && !KEEP_INHERITED.has(p.name)) continue;
      if (p.name === "className" || p.name === "children" || p.name.startsWith("on")) continue;
      const t = checker.getTypeOfSymbolAtLocation(p, decl);
      const c = controlFor(t);
      if (!c) continue;
      const description = ts.displayPartsToString(p.getDocumentationComment(checker)) || undefined;
      const def = pd[p.name] ?? defaults[p.name];
      props.push({ name: p.name, ...c, ...(def !== undefined ? { default: def } : {}), ...(description ? { description } : {}) });
    }
    if (props.length) comps[exp.name] = props;
  }
  if (Object.keys(comps).length) result[path.basename(file, ".tsx")] = comps;
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n");
const n = Object.values(result).reduce((a, c) => a + Object.keys(c).length, 0);
console.log(`${path.relative(ROOT, OUT)}: ${n} components with props`);
