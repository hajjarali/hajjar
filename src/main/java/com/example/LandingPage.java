package com.example;

import java.io.IOException;

/**
 * The landing page: the site's {@code /} route.
 *
 * <p>Minimal by design — the spec's scope rules out any other landing-page
 * section, so the page carries a short welcome and nothing more. It renders
 * through the shared shell, so the site's main navigation (with the About link)
 * appears here exactly as it does on every other page.</p>
 */
final class LandingPage {

    static final String PATH = "/";
    static final String HEADING = "Welcome";

    private static final String PARAGRAPH =
            "<p>This is the Example Company site. Use the navigation above to find "
                    + "out who we are and what we do.</p>";

    private LandingPage() {
    }

    /** Renders the landing page inside the shared page shell. */
    static String render() throws IOException {
        String content = "<h1>" + HEADING + "</h1>\n" + PARAGRAPH + "\n";
        return PageHandler.renderShell(HEADING, content);
    }
}
