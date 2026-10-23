const assert = require('node:assert/strict');
const test = require('node:test');
const { interpreters, loadRuntime } = require('./runtime.cjs');

for (const filename of interpreters) {
  test(`${filename}: JS.STRING preserves commas in strings`, () => {
    const runtime = loadRuntime(filename);
    assert.equal(runtime.evalExpr('JS.STRING strcat, "hello, ", "world"'), 'hello, world');
    assert.equal(runtime.evalExpr('JS.STRING strlen, "a,b"'), 3);
    assert.equal(runtime.evalExpr('JS.STRING strcmp, "a,b", "a,b"'), 1);
  });

  test(`${filename}: JS.STRING preserves a nested array index`, () => {
    const runtime = loadRuntime(filename);
    runtime.parseGlobalDecl('string words[2] = {"first", "second"};');
    assert.equal(runtime.evalExpr('JS.STRING strcat, words[JS.MATH max, 0, 1], "!"'), 'second!');
  });

  test(`${filename}: JS.MATH preserves a nested array index`, () => {
    const runtime = loadRuntime(filename);
    runtime.parseGlobalDecl('int values[2] = {2, 7};');
    assert.equal(runtime.evalExpr('JS.MATH max, values[JS.MATH max, 0, 1], 3'), 7);
  });

  test(`${filename}: JS.WEB preserves commas in URLs`, async () => {
    const requests = [];
    const runtime = loadRuntime(filename, {
      async fetch(url) {
        requests.push(url);
        return { async text() { return 'response'; } };
      }
    });
    const result = await runtime.evalExprAsync('JS.WEB getText, "https://example.test/?ids=a,b"');
    assert.equal(result, 'response');
    assert.deepEqual(requests, ['https://example.test/?ids=a,b']);
  });

  test(`${filename}: existing simple JS bridge arguments still work`, () => {
    const runtime = loadRuntime(filename);
    assert.equal(runtime.evalExpr('JS.MATH max, 2, 7'), 7);
    assert.equal(runtime.evalExpr('JS.STRING strncpy, "hello", 3'), 'hel');
  });

  test(`${filename}: printf percent escapes do not consume arguments`, () => {
    const runtime = loadRuntime(filename);
    assert.equal(runtime.formatPrintf('%% %d %s %.2f', [7, 'ok', 1.25]), '% 7 ok 1.25');
    assert.equal(runtime.formatPrintf('%%%% %d %% %f', [8, 2]), '%% 8 % 2.000000');
  });

  test(`${filename}: unsupported printf specifiers remain literal`, () => {
    const runtime = loadRuntime(filename);
    assert.equal(runtime.formatPrintf('%q %d', [9]), '%q 9');
    assert.equal(runtime.formatPrintf('trailing %', []), 'trailing %');
  });

  test(`${filename}: complete programs preserve bridge and printf arguments`, async () => {
    const runtime = loadRuntime(filename);
    await runtime.compileAndRun(`
string message;
int main() {
  message = JS.STRING strcat, "hello, ", "world";
  printf("%% %d %s\\n", 7, message);
  return 0;
}
`);
    assert.equal(runtime.document.getElementById('output').textContent, '% 7 hello, world\n');
  });
}
