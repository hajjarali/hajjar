package com.example;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

/**
 * Self-checking main for the web layer (Task 1). Run with:
 * {@code mvn -q compile exec:java -Dexec.mainClass=com.example.WebLayerCheck -Dexec.classpathScope=test}
 *
 * <p>Deliberately plain Java with no test framework: the acceptance criteria forbid
 * adding a Maven dependency, and JUnit would be one. Exits non-zero on any failure.</p>
 */
public class WebLayerCheck {

    private static final List<String> FAILURES = new ArrayList<>();

    public static void main(String[] args) throws Exception {
        int port = 18080 + (int) (Math.random() * 2000);
        App app = new App();
        app.start(port);
        try {
            check("app_bindsRequestedPort", app.boundPort() == port,
                    "expected port " + port + " but bound " + app.boundPort());
            check("app_portFromEnvDefaultsTo8080", App.portFromEnv() == 8080,
                    "APP_PORT unset should default to 8080, got " + App.portFromEnv());

            HttpURLConnection root = get(port, "/");
            check("unregisteredPath_returns404", root.getResponseCode() == 404,
                    "GET / returned " + root.getResponseCode() + ", expected 404");
            String rootBody = body(root);
            check("notFound_wellFormedHtml", rootBody.startsWith("<!DOCTYPE html>")
                            && rootBody.trim().endsWith("</html>"),
                    "404 body is not well-formed HTML: " + snippet(rootBody));
            check("notFound_renderedThroughSharedShell",
                    rootBody.contains("<link rel=\"stylesheet\" href=\"/assets/styles.css\">")
                            && rootBody.contains("<nav>"),
                    "404 body does not carry the shared shell chrome");

            HttpURLConnection css = get(port, PageHandler.STYLESHEET_PATH);
            check("stylesheet_served", css.getResponseCode() == 200
                            && css.getContentType().startsWith("text/css"),
                    "GET " + PageHandler.STYLESHEET_PATH + " returned " + css.getResponseCode()
                            + " " + css.getContentType());
        } finally {
            app.stop();
        }

        if (FAILURES.isEmpty()) {
            System.out.println("ALL CHECKS PASSED");
        } else {
            System.out.println("FAILED CHECKS:");
            FAILURES.forEach(f -> System.out.println("  - " + f));
            System.exit(1);
        }
    }

    private static HttpURLConnection get(int port, String path) throws IOException {
        return (HttpURLConnection) URI.create("http://localhost:" + port + path)
                .toURL().openConnection();
    }

    private static String body(HttpURLConnection connection) throws IOException {
        InputStream in = connection.getResponseCode() < 400
                ? connection.getInputStream() : connection.getErrorStream();
        try (in) {
            return in == null ? "" : new String(in.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
        }
    }

    private static String snippet(String s) {
        return s.length() <= 120 ? s : s.substring(0, 120) + "...";
    }

    private static void check(String name, boolean condition, String detail) {
        if (condition) {
            System.out.println("PASS " + name);
        } else {
            FAILURES.add(name + ": " + detail);
        }
    }
}
