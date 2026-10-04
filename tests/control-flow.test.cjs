const assert = require('node:assert/strict');
const test = require('node:test');
const { interpreters, loadRuntime } = require('./runtime.cjs');

for (const filename of interpreters) {
  test(`${filename}: return stops execution immediately`, async () => {
    const runtime = loadRuntime(filename);
    const result = await runtime.compileAndRun(`
int main() {
  printf("before\\n");
  return 0;
  printf("after\\n");
}
`);
    assert.equal(runtime.document.getElementById('output').textContent, 'before\n');
    assert.equal(result, 0);
  });

  test(`${filename}: return evaluates its expression`, async () => {
    const runtime = loadRuntime(filename);
    const result = await runtime.compileAndRun(`
int code;
int main() {
  code = 6;
  return code - 9;
  code = 99;
}
`);
    assert.equal(result, -3);
    assert.equal(runtime.evalExpr('code'), 6);
  });

  test(`${filename}: return exits the selected label without falling through`, async () => {
    for (const polarity of [1, -1]) {
      const runtime = loadRuntime(filename);
      const result = await runtime.compileAndRun(`
int main() {
  goto(${polarity}, positive, negative);
  :positive {
    printf("positive");
    return 7;
    printf("unreachable");
  }
  :negative {
    printf("negative");
    return 9;
    printf("unreachable");
  }
  printf("after labels");
}
`);
      assert.equal(result, polarity === 1 ? 7 : 9);
      assert.equal(runtime.document.getElementById('output').textContent, polarity === 1 ? 'positive' : 'negative');
    }
  });

  test(`${filename}: bare return stops execution`, async () => {
    const runtime = loadRuntime(filename);
    const result = await runtime.compileAndRun(`
int main() {
  return;
  printf("unreachable");
}
`);
    assert.equal(result, undefined);
    assert.equal(runtime.document.getElementById('output').textContent, '');
  });

  test(`${filename}: return awaits asynchronous expressions once`, async () => {
    let requests = 0;
    const runtime = loadRuntime(filename, {
      async fetch(url) {
        assert.equal(url, 'https://example.test/status');
        requests++;
        return { async text() { return 'ready'; } };
      }
    });
    const result = await runtime.compileAndRun(`
int main() {
  return JS.WEB getText, "https://example.test/status";
  printf("unreachable");
}
`);
    assert.equal(result, 'ready');
    assert.equal(requests, 1);
    assert.equal(runtime.document.getElementById('output').textContent, '');
  });

  test(`${filename}: return-prefixed variables are ordinary assignments`, async () => {
    const runtime = loadRuntime(filename);
    await runtime.compileAndRun(`
int returnCode;
int main() {
  returnCode = 4;
  printf("%d", returnCode);
}
`);
    assert.equal(runtime.document.getElementById('output').textContent, '4');
  });

  test(`${filename}: goto still routes programs without explicit return`, async () => {
    const runtime = loadRuntime(filename);
    const result = await runtime.compileAndRun(`
int main() {
  goto(1, selected, skipped);
  :selected {
    printf("selected");
  }
  :skipped {
    printf("skipped");
  }
  printf("done");
}
`);
    assert.equal(result, undefined);
    assert.equal(runtime.document.getElementById('output').textContent, 'selecteddone');
  });
}
