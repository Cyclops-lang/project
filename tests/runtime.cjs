const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const interpreters = ['Cyclops-lang_v1-0.html', 'Cyclops_v1-0_for_Med.html'];

function loadRuntime(filename, overrides = {}) {
  const html = fs.readFileSync(path.join(__dirname, '..', filename), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!script) throw new Error(`No interpreter script in ${filename}`);

  const elements = new Map();
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, { value: '', textContent: '' });
      return elements.get(id);
    }
  };
  const context = vm.createContext({ document, ...overrides });
  vm.runInContext(script[1], context, { filename });
  return context;
}

module.exports = { interpreters, loadRuntime };
