package com.example;

import java.io.IOException;

/**
 * The static About page: who the company is and what it does.
 *
 * <p>The content is fixed prose held as constants in this artifact — no entity,
 * no content store, no editing path (the spec's Data model section rules those
 * out). The page renders through the shared shell, so it carries the site's
 * layout, stylesheet and navigation like every other page.</p>
 */
final class AboutPage {

    static final String PATH = "/about";
    static final String HEADING = "About";

    private static final String[] PARAGRAPHS = {
            "<p>We are Example Company, a small team that builds straightforward "
                    + "software for everyday business needs.</p>",
            "<p>Our work focuses on tools that are simple to adopt, honest about "
                    + "what they do, and dependable in daily use.</p>",
            "<p>We believe good software should get out of the way: clear pages, "
                    + "plain language, and no unnecessary steps between you and the "
                    + "thing you came for.</p>"
    };

    private AboutPage() {
    }

    /** Renders the About page inside the shared page shell. */
    static String render() throws IOException {
        StringBuilder content = new StringBuilder();
        content.append("<h1>").append(HEADING).append("</h1>\n");
        for (String paragraph : PARAGRAPHS) {
            content.append(paragraph).append('\n');
        }
        return PageHandler.renderShell(HEADING, content.toString());
    }
}
