package com.example.htmlpage;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

/** Static-content checks on the single-file game page. */
class CucumberPanicStaticTest {

    private static final Path FILE = Path.of("src/main/resources/cucumber-panic.html");
    private static String html;

    @BeforeAll
    static void load() throws IOException {
        html = Files.readString(FILE, StandardCharsets.UTF_8);
    }

    @Test
    void a1_noExternalReferences() {
        Matcher m = Pattern.compile("(?i)\\b(?:src|href)\\s*=\\s*[\"']?\\s*([^\"'\\s>]*)").matcher(html);
        while (m.find()) {
            String target = m.group(1);
            assertTrue(target.isEmpty() || target.startsWith("#"), "external src/href: " + target);
        }
        assertFalse(Pattern.compile("(?i)@import").matcher(html).find(), "@import found");
        Matcher u = Pattern.compile("(?i)url\\(\\s*[\"']?([^)\"']*)").matcher(html);
        while (u.find()) {
            assertTrue(u.group(1).startsWith("#"), "external url(): " + u.group(1));
        }
        assertFalse(Pattern.compile("(?i)https?://|//[a-z0-9.-]+\\.[a-z]{2,}/").matcher(html).find(),
                "network address found");
    }

    @Test
    void a12_noDataUriImgOrAudioAndDrawsOnCanvas() {
        assertFalse(Pattern.compile("(?i)data:").matcher(html).find(), "data: URI");
        assertFalse(Pattern.compile("(?i)<img\\b").matcher(html).find(), "<img>");
        assertFalse(Pattern.compile("(?i)<audio\\b").matcher(html).find(), "<audio>");
        assertFalse(Pattern.compile("(?i)<(?:video|source|link|iframe|embed|object)\\b").matcher(html).find(),
                "external media element");
        assertTrue(html.contains("<canvas") && html.contains("getContext('2d')"), "draws on a canvas");
    }

    @Test
    void fileIsAtMost100Kb() throws IOException {
        assertTrue(Files.size(FILE) <= 100 * 1024, "file larger than 100 KB");
        assertEquals(1, html.split("(?i)<html", -1).length - 1, "exactly one html document");
    }
}
