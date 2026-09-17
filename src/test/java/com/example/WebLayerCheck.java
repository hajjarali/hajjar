package com.example;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

/**
 * Self-checking main for the web layer, the About page and the landing page
 * (Tasks 1–3). Run with:
 * {@code mvn -q compile test-compile exec:java -Dexec.mainClass=com.example.WebLayerCheck -Dexec.classpathScope=test}
 *
 * <p>Deliberately plain Java with no test framework: the acceptance criteria forbid
 * adding a Maven dependency, and JUnit would be one. Exits non-zero on any failure.
 * Results are also written to {@code target/web-layer-check.log} so a headless run
 * can be verified afterwards.</p>
 */
public class WebLayerCheck {

    private static final List<String> FAILURES = new ArrayList<>();
    private static final List<String> LINES = new ArrayList<>();

    public static void main(String[] args) throws Exception {
        int port = 18080 + (int) (Math.random() * 2000);
        App app = new App();
        app.start(port);
        try {
            // Task 1: server and shell
            check("app_bindsRequestedPort", app.boundPort() == port,
                    "expected port " + port + " but bound " + app.boundPort());
            check("app_portFromEnvDefaultsTo8080", App.portFromEnv() == 8080,
                    "APP_PORT unset should default to 8080, got " + App.portFromEnv());

            // Task 3 made / a real page, so 404 is asserted on a path no page claims.
            HttpURLConnection missing = get(port, "/no-such-page");
            check("unregisteredPath_returns404", missing.getResponseCode() == 404,
                    "GET /no-such-page returned " + missing.getResponseCode() + ", expected 404");
            String missingBody = body(missing);
            check("notFound_wellFormedHtml", missingBody.startsWith("<!DOCTYPE html>")
                            && missingBody.trim().endsWith("</html>"),
                    "404 body is not well-formed HTML: " + snippet(missingBody));
            check("notFound_renderedThroughSharedShell",
                    missingBody.contains("<link rel=\"stylesheet\" href=\"/assets/styles.css\">")
                            && missingBody.contains("<nav>"),
                    "404 body does not carry the shared shell chrome");

            HttpURLConnection css = get(port, PageHandler.STYLESHEET_PATH);
            check("stylesheet_served", css.getResponseCode() == 200
                            && css.getContentType().startsWith("text/css"),
                    "GET " + PageHandler.STYLESHEET_PATH + " returned " + css.getResponseCode()
                            + " " + css.getContentType());

            // Task 2 (A1): /about renders heading + body paragraphs, no credentials
            HttpURLConnection about = get(port, AboutPage.PATH);
            check("a1_about_returns200", about.getResponseCode() == 200,
                    "GET " + AboutPage.PATH + " returned " + about.getResponseCode() + ", expected 200");
            String aboutBody = body(about);
            check("a1_about_displaysHeading",
                    aboutBody.contains("<h1>About</h1>"),
                    "About page is missing the <h1>About</h1> heading: " + snippet(aboutBody));
            check("a1_about_displaysBodyParagraphs",
                    count(aboutBody, "<p>") >= 3,
                    "About page should carry several body paragraphs, found "
                            + count(aboutBody, "<p>") + " <p> elements");
            check("a1_about_renderedThroughSharedShell",
                    aboutBody.contains("<link rel=\"stylesheet\" href=\"/assets/styles.css\">")
                            && aboutBody.contains("<nav>"),
                    "About page does not carry the shared shell chrome");

            // Task 3 (A2): landing page carries the About link in the main navigation
            HttpURLConnection landing = get(port, LandingPage.PATH);
            check("a2_landing_returns200", landing.getResponseCode() == 200,
                    "GET " + LandingPage.PATH + " returned " + landing.getResponseCode() + ", expected 200");
            String landingBody = body(landing);
            check("a2_landing_navLinksToAbout",
                    landingBody.contains("<nav>") && landingBody.contains("</nav>")
                            && navRegion(landingBody).contains("<a href=\"/about\">About</a>"),
                    "landing page nav does not carry the About link: " + snippet(landingBody));
            check("a2_landing_renderedThroughSharedShell",
                    landingBody.contains("<link rel=\"stylesheet\" href=\"/assets/styles.css\">"),
                    "landing page does not carry the shared shell chrome");
            check("a2_about_navLinksToAbout",
                    navRegion(aboutBody).contains("<a href=\"/about\">About</a>"),
                    "About page nav does not carry the About link (nav must be shared, not per-page)");
        } finally {
            app.stop();
        }

        if (FAILURES.isEmpty()) {
            line("ALL CHECKS PASSED");
        } else {
            line("FAILED CHECKS:");
            for (String failure : FAILURES) {
                line("  - " + failure);
            }
        }
        writeReport();
        if (!FAILURES.isEmpty()) {
            System.exit(1);
        }
    }

    /** The text between the page's {@code <nav>} and {@code </nav>} markers. */
    private static String navRegion(String page) {
        int start = page.indexOf("<nav>");
        int end = page.indexOf("</nav>");
        if (start == -1 || end == -1 || end < start) {
            return "";
        }
        return page.substring(start + "<nav>".length(), end);
    }

    private static int count(String haystack, String needle) {
        int n = 0;
        int index = 0;
        while ((index = haystack.indexOf(needle, index)) != -1) {
            n++;
            index += needle.length();
        }
        return n;
    }

    private static void writeReport() {
        try {
            Path report = Path.of("target", "web-layer-check.log");
            Files.createDirectories(report.getParent());
            Files.write(report, (String.join(System.lineSeparator(), LINES) + System.lineSeparator())
                    .getBytes(StandardCharsets.UTF_8));
        } catch (IOException e) {
            System.out.println("Could not write report: " + e.getMessage());
        }
    }

    private static HttpURLConnection get(int port, String path) throws IOException {
        HttpURLConnection connection =
                (HttpURLConnection) URI.create("http://localhost:" + port + path).toURL().openConnection();
        connection.setConnectTimeout(5_000);
        connection.setReadTimeout(5_000);
        return connection;
    }

    private static String body(HttpURLConnection connection) throws IOException {
        InputStream in = connection.getResponseCode() < 400
                ? connection.getInputStream() : connection.getErrorStream();
        try (in) {
            return in == null ? "" : new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private static String snippet(String s) {
        return s.length() <= 120 ? s : s.substring(0, 120) + "...";
    }

    private static void line(String text) {
        LINES.add(text);
        System.out.println(text);
    }

    private static void check(String name, boolean condition, String detail) {
        if (condition) {
            line("PASS " + name);
        } else {
            FAILURES.add(name + ": " + detail);
        }
    }
}
