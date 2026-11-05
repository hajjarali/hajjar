package com.example.htmlpage;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;

/** Runs the node harness against the page; skipped when node is not installed. */
class CucumberPanicBehaviourTest {

    @Test
    void nodeHarnessPasses() throws Exception {
        Process probe;
        try {
            probe = new ProcessBuilder("node", "--version").redirectErrorStream(true).start();
            probe.getInputStream().readAllBytes();
            assumeTrue(probe.waitFor() == 0, "node not available");
        } catch (java.io.IOException e) {
            assumeTrue(false, "node not available");
        }
        Process p = new ProcessBuilder("node", "src/test/resources/cucumber-panic.test.mjs",
                Path.of("src/main/resources/cucumber-panic.html").toString())
                .redirectErrorStream(true).start();
        String out = new String(p.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        assertEquals(0, p.waitFor(), out);
    }
}
