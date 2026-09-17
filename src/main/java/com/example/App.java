package com.example;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Entry point: starts the embedded HTTP server that serves the site.
 *
 * <p>Uses the JDK's built-in {@code com.sun.net.httpserver.HttpServer} — no web
 * framework and no additional Maven dependency. The server binds port 8080 by
 * default; set the {@code APP_PORT} environment variable to override. No
 * authentication is registered: every page is readable by unauthenticated visitors.</p>
 */
public class App {

    /** Default port the server binds when {@code APP_PORT} is unset. */
    static final int DEFAULT_PORT = 8080;

    private HttpServer server;
    private ExecutorService executor;

    public static void main(String[] args) throws IOException {
        new App().start(portFromEnv());
    }

    /** Resolves the port to bind: {@code APP_PORT} when set, otherwise 8080. */
    static int portFromEnv() {
        String raw = System.getenv("APP_PORT");
        if (raw == null || raw.isBlank()) {
            return DEFAULT_PORT;
        }
        return Integer.parseInt(raw.trim());
    }

    /** Starts the server on the given port and returns once it is accepting connections. */
    void start(int port) throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", new PageHandler());
        // Daemon threads: the JVM must be free to exit when main returns.
        executor = Executors.newFixedThreadPool(4, runnable -> {
            Thread thread = new Thread(runnable);
            thread.setDaemon(true);
            return thread;
        });
        server.setExecutor(executor);
        server.start();
        System.out.println("Serving on port " + port);
    }

    void stop() {
        if (server != null) {
            server.stop(0);
        }
        if (executor != null) {
            executor.shutdownNow();
        }
    }

    /** Port the running server is bound to, for diagnostics and tests. */
    int boundPort() {
        return server.getAddress().getPort();
    }
}
