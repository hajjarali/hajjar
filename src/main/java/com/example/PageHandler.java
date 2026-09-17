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
 * <p>Routes registered by later tasks plug their content into the same shell, so
 * every page of the site shares one layout and one stylesheet. Paths with no
 * registered page get a well-formed 404 rendered through the same shell.</p>
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
        String page = renderShell("Page not found", content);
        byte[] body = page.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "text/html; charset=utf-8");
        exchange.sendResponseHeaders(404, body.length);
        try (OutputStream out = exchange.getResponseBody()) {
            out.write(body);
        }
    }

    /**
     * Renders {@code content} inside the shared page shell.
     *
     * <p>The shell's navigation region is currently empty; a later task populates
     * it, and because every page renders through this shell the nav then appears
     * site-wide without duplicated markup.</p>
     */
    static String renderShell(String title, String content) throws IOException {
        String layout = readResource(LAYOUT_RESOURCE);
        return layout
                .replace("{{TITLE}}", escapeHtml(title))
                .replace("{{NAV}}", "")
                .replace("{{CONTENT}}", content);
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
