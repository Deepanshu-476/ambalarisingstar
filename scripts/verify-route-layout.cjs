const assert = require('node:assert/strict');
// Server-render public routes to verify site chrome and login semantics.
// Internal dashboards, the WebGL scene and PDF exports are outside this check;
// their modules are stubbed so this runs without a browser or backend requests.
const path = require('node:path');
const Module = require('node:module');
const esbuild = require('esbuild');
const React = require('react');
const { renderToPipeableStream } = require('react-dom/server');
const { PassThrough } = require('node:stream');
const render = element => new Promise((resolve, reject) => {
  const output = new PassThrough(); let html = '';
  output.on('data', chunk => { html += chunk; }); output.on('end', () => resolve(html));
  const stream = renderToPipeableStream(element, { onAllReady() { stream.pipe(output); }, onError: reject });
});
const { MemoryRouter } = require('react-router-dom');
(async () => {
  const result = await esbuild.build({ stdin: { contents: "export {default} from './src/App.jsx'", resolveDir: process.cwd(), loader: 'jsx' }, bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external', jsx: 'automatic', define: { 'import.meta.env': '{}' }, plugins: [{name: 'non-code-assets', setup(build) { build.onLoad({filter: /[\\/]pages[\\/](?:admin[\\/]AdminDashboard|Slots[\\/]SlotsPage|captain[\\/](?:CaptainDashboard|ChampionsTrophy)|AdminDashboard|ScrollCricketScene)\.jsx$/}, () => ({contents: 'export default function InternalPage() { return null; }', loader: 'js'})); build.onResolve({filter: /^(jspdf|jspdf-autotable)$/}, args => ({path: args.path, namespace: 'pdf-stub'})); build.onLoad({filter: /.*/, namespace: 'pdf-stub'}, () => ({contents: 'export function jsPDF() {} export default function autoTable() {}', loader: 'js'})); build.onLoad({filter: /\.(css|png|jpe?g|mp4|svg|webp)$/}, args => ({contents: `export default ${JSON.stringify(args.path)}`, loader: 'js'})); }}] });
  const mod = new Module(path.join(process.cwd(), 'route-smoke.cjs'), module);
  mod.filename = path.join(process.cwd(), 'route-smoke.cjs');
  mod.paths = module.paths;
  global.localStorage = {getItem: () => null};
  mod._compile(result.outputFiles[0].text, mod.filename);
  global.window = { scrollY: 0, innerWidth: 1440 };
  const App = mod.exports.default;
  for (const route of ['/', '/gallery', '/contact', '/terms', '/refund', '/privacy', '/login', '/playerRegistration', '/Ambala-Rising-Star', '/book-slots']) {
    const html = await render(React.createElement(MemoryRouter, {initialEntries: [route]}, React.createElement(App)));
    const chrome = ['/', '/gallery', '/contact', '/terms', '/refund', '/privacy'].includes(route);
    assert.equal(html.includes('class="site-header'), chrome, route + ': site header');
    assert.equal(html.includes('class="site-footer"'), chrome, route + ': site footer');
    if (route === '/login') {
      assert.ok(html.includes('role="dialog"'));
      assert.ok(html.includes('id="auth-email"'));
      assert.ok(html.toLowerCase().includes('autocomplete="current-password"'));
      assert.ok(html.includes('aria-label="Close login"'));
    }
    console.log('PASS ' + route);
  }
})().catch(error => {console.error(error);process.exitCode = 1;});
