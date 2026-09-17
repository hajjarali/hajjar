package com.example;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/**
 * Serves every page through the shared page shell (layout + stylesheet).
 *
 * <p>Registered pages plug their content into the same shell, so every page of
 * the site shares one layout, one stylesheet and one navigation region. Paths
 * with no registered page get a well-formed 404 rendered through the same shell.</p>
 */
class PageHandler implements HttpHandler {

    static final String STYLESHEET_PATH = "/assets/styles.css";
    private static final String LAYOUT_RESOURCE = "/web/layout.html";
    private static final String STYLESHEET_RESOURCE = "/web/styles.css";

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        if (STYLESHEET_PATH.equals(path)) {
            serveStylesheet(exchange);
        } else if (LandingPage.PATH.equals(path)) {
            serveHtml(exchange, 200, LandingPage.render());
        } else if (AboutPage.PATH.equals(path)) {
            serveHtml(exchange, 200, AboutPage.render());
        } else {
            serveNotFound(exchange, path);
        }
    }

    private void serveStylesheet(HttpExchange exchange) throws IOException {
        String css = readResource(STYLESHEET_RESOURCE);
        byte[] body = css.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "text/css; charset=utf-8");
        exchange.sendResponseHeaders(200, body.length);
        try (OutputStream out = exchange.getResponseBody()) {
            out.write(body);
        }
    }

    private void serveNotFound(HttpExchange exchange, String path) throws IOException {
        String content = "<h1>Page not found</h1>\n"
                + "<p>There is no page at <code>" + escapeHtml(path) + "</code>.</p>";
        serveHtml(exchange, 404, PageHandler.renderShell("Page not found", content));
    }

    private static void serveHtml(HttpExchange exchange, int status, String page) throws IOException {
        byte[] body = page.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "text/html; charset=utf-8");
        exchange.sendResponseHeaders(status, body.length);
        try (OutputStream out = exchange.getResponseBody()) {
            out.write(body);
        }
    }

    /**
     * Renders {@code content} inside the shared page shell.
     *
     * <p>The shell's navigation region carries the site's main navigation. It is
     * defined once here, so the nav renders on every page — landing page and
     * About alike — without duplicated markup.</p>
     */
    static String renderShell(String title, String content) throws IOException {
        String layout = readResource(LAYOUT_RESOURCE);
        return layout
                .replace("{{TITLE}}", escapeHtml(title))
                .replace("{{NAV}}", mainNavigation())
                .replace("{{CONTENT}}", content);
    }

    /** The site's main navigation — defined once, rendered on every page. */
    private static String mainNavigation() {
        return "<a href=\"" + AboutPage.PATH + "\">About</a>";
    }

    private static String readResource(String resourcePath) throws IOException {
        try (InputStream in = PageHandler.class.getResourceAsStream(resourcePath)) {
            if (in == null) {
                throw new IOException("Missing classpath resource: " + resourcePath);
            }
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private static String escapeHtml(String text) {
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }
}
