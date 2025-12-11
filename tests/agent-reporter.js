/**
 * Agent-Friendly Reporter
 * Minimizes token usage by only outputting failures with concise error messages
 */

class AgentReporter {
    constructor(options) {
        this.options = options;
    }

    printsToStdio() {
        return true;
    }

    onBegin(config, suite) {
        const testCount = suite.allTests().length;
        console.log(`\n🧹 Starting ${testCount} test${testCount !== 1 ? 's' : ''}`);
    }

    onTestEnd(test, result) {
        if (result.status === 'failed') {
            console.log(`\n❌ FAILED: ${test.title}`);
            console.log(`   File: ${test.location.file}:${test.location.line}`);

            // Only print first 5 lines of error to save tokens
            if (result.error?.message) {
                const errorLines = result.error.message.split('\n').slice(0, 5);
                console.log(`   ${errorLines.join('\n   ')}`);
            }

            // Log screenshot path if available
            if (result.attachments?.length > 0) {
                const screenshot = result.attachments.find(a => a.name === 'screenshot');
                if (screenshot) {
                    console.log(`   📸 Screenshot: ${screenshot.path}`);
                }
            }
        }
    }

    onEnd(result) {
        console.log(`\n${'='.repeat(50)}`);
        console.log(`✅ Passed: ${result.passed} | ❌ Failed: ${result.failed} | ⏭️  Skipped: ${result.skipped}`);
        console.log(`⏱️  Duration: ${(result.duration / 1000).toFixed(1)}s`);

        if (result.failed === 0) {
            console.log('🎉 All tests passed!');
        }

        console.log('='.repeat(50));
    }
}

export default AgentReporter;
