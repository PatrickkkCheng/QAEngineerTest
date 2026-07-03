import type { Reporter, TestCase, TestResult } from "@playwright/test/reporter";

// A trimmed-down alternative to the built-in "list" reporter: only the describe
// block title + test title + project name, no file path or line:column noise.
class MinimalListReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    const icon =
      result.status === "passed"
        ? "✓"
        : result.status === "skipped"
          ? "○"
          : "✗";
    const project = test.parent.project()?.name ?? "";
    console.log(
      `${icon} [${project}] ${test.parent.title} (${result.duration}ms)`,
    );
  }
}

export default MinimalListReporter;
