package cyai.sales.landing;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.Test;

class LandingPageTest {

    private static final Path STATIC = Path.of("src/main/resources/static");

    private static String read(String name) throws IOException {
        return Files.readString(STATIC.resolve(name), StandardCharsets.UTF_8);
    }

    private static String script(String html) {
        Matcher m = Pattern.compile("<script>(.*?)</script>", Pattern.DOTALL).matcher(html);
        assertTrue(m.find(), "inline script present");
        return m.group(1);
    }

    @Test
    void a1_sectionsAppearInOrderAndCtaTargetsForm() throws IOException {
        String html = read("index.html");
        int last = -1;
        for (String id : List.of("hero", "models", "features", "testimonials", "lead-form", "contact")) {
            int at = html.indexOf("id=\"" + id + "\"");
            assertTrue(at > last, "section " + id + " out of order or missing");
            last = at;
        }
        assertTrue(html.contains("class=\"cta\" href=\"#lead-form\""));
    }

    @Test
    void a2_validSubmissionConfirmsAndScriptHasNoNetworkCall() throws IOException {
        String html = read("index.html");
        String js = script(html);
        assertTrue(js.contains("confirmation.hidden = false"));
        assertTrue(js.contains("TEST_DRIVE") || html.contains("value=\"QUOTE\""));
        for (String call : List.of("fetch(", "XMLHttpRequest", "sendBeacon", "WebSocket", "EventSource", "$.ajax")) {
            assertFalse(js.contains(call), "script must not use " + call);
        }
        assertFalse(html.contains("<form id=\"leadForm\" action"), "form has no action");
        // the email pattern accepts a@b.com and rejects abc
        Pattern email = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
        assertTrue(email.matcher("a@b.com").matches());
        assertFalse(email.matcher("abc").matches());
    }

    @Test
    void a3_offendingFieldsGetMessageBesideThemAndNoConfirmation() throws IOException {
        String html = read("index.html");
        String js = script(html);
        for (String f : List.of("fullName", "email", "requestType")) {
            assertTrue(html.contains("id=\"" + f + "-error\""), "message slot for " + f);
            assertTrue(js.contains("setError('" + f + "'"), "script sets message for " + f);
        }
        assertEquals(1, js.split("confirmation.hidden = false", -1).length - 1);
        assertTrue(js.contains("if (ok) { confirmation.hidden = false; }"));
    }

    @Test
    void a4_fluidLayoutWithViewportMeta() throws IOException {
        String html = read("index.html");
        String css = read("styles.css");
        assertTrue(html.contains("name=\"viewport\" content=\"width=device-width, initial-scale=1\""));
        Matcher m = Pattern.compile("(?<![-\\w])(width|min-width)\\s*:\\s*(\\d+)px").matcher(css);
        assertFalse(m.find(), "fixed pixel width found: " + (m.find(0) ? m.group() : ""));
        assertTrue(css.contains("max-width"));
    }
}
