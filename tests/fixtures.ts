/**
 * Shared test fixtures and utilities
 * Following DRY principles - all test data centralized here
 */

export const testCases = {
  essential: {
    // Input → Expected output pairs for essential mode
    basic: [
      { input: "Hello World", expected: "Hello World", escapedCount: 0 },
      { input: "Test's quote", expected: "Test&#39;s quote", escapedCount: 1 },
      { input: 'Say "hello"', expected: "Say &quot;hello&quot;", escapedCount: 2 },
      { input: "<script>", expected: "&lt;script&gt;", escapedCount: 2 },
      { input: "Tom & Jerry", expected: "Tom &amp; Jerry", escapedCount: 1 },
    ],
    combined: [
      {
        input: `It's a "test" with <tags> & symbols`,
        expected: `It&#39;s a &quot;test&quot; with &lt;tags&gt; &amp; symbols`,
        escapedCount: 6,
      },
    ],
    alreadyEscaped: [
      { input: "&amp;", expected: "&amp;", escapedCount: 0 },
      { input: "&lt;div&gt;", expected: "&lt;div&gt;", escapedCount: 0 },
      { input: "&#39;quoted&#39;", expected: "&#39;quoted&#39;", escapedCount: 0 },
      { input: "&quot;test&quot;", expected: "&quot;test&quot;", escapedCount: 0 },
    ],
    mixed: [
      {
        input: "Already &amp; but also &",
        expected: "Already &amp; but also &amp;",
        escapedCount: 1,
      },
    ],
  },
  extended: {
    basic: [
      { input: "© 2024", expected: "&copy; 2024", escapedCount: 1 },
      { input: "Trademark™", expected: "Trademark&trade;", escapedCount: 1 },
      { input: "Registered®", expected: "Registered&reg;", escapedCount: 1 },
      { input: "Em—dash", expected: "Em&mdash;dash", escapedCount: 1 },
      { input: "En–dash", expected: "En&ndash;dash", escapedCount: 1 },
    ],
  },
  noChanges: [
    { input: "", expected: "", escapedCount: 0 },
    { input: "Plain text without entities", expected: "Plain text without entities", escapedCount: 0 },
    { input: "Numbers 12345", expected: "Numbers 12345", escapedCount: 0 },
  ],
};

/**
 * Sample file content for integration tests
 */
export const sampleFiles = {
  htmlWithEntities: `<!DOCTYPE html>
<html>
<head><title>Test's Page</title></head>
<body>
  <p>Hello "World" & Friends</p>
</body>
</html>`,
  htmlFixed: `<!DOCTYPE html>
&lt;html&gt;
&lt;head&gt;&lt;title&gt;Test&#39;s Page&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
  &lt;p&gt;Hello &quot;World&quot; &amp; Friends&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;`,
  jsxWithEntities: `export const Component = () => {
  return <div>It's a "test" & more</div>;
};`,
  cleanFile: `// This is a clean file
const value = 42;
`,
};
