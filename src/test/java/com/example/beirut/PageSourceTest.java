package com.example.beirut;

import static org.junit.jupiter.api.Assertions.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class PageSourceTest {

    static String html;

    @BeforeAll
    static void load() throws IOException {
        try (InputStream in = PageSourceTest.class.getResourceAsStream("/beirut.html")) {
            assertNotNull(in, "beirut.html must be on the classpath");
            html = new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private static int count(String regex) {
        Matcher m = Pattern.compile(regex, Pattern.CASE_INSENSITIVE).matcher(html);
        int n = 0;
        while (m.find()) n++;
        return n;
    }

    private static String meta(String attr, String name) {
        Matcher m = Pattern.compile("<meta\\s+" + attr + "=\"" + Pattern.quote(name) + "\"\\s+content=\"([^\"]*)\"").matcher(html);
        assertTrue(m.find(), "missing meta " + name);
        return m.group(1);
    }

    @Test
    void a1_noExternalStylesheetScriptSrcOrFontUrl() {
        assertEquals(0, count("<link[^>]+rel=\"stylesheet\""));
        assertEquals(0, count("<script[^>]+src="));
        assertEquals(0, count("fonts\\.(googleapis|gstatic)|@font-face|\\.woff2?|\\.ttf|\\.otf"));
    }

    @Test
    void a2_sectionsAppearInOrder() {
        List<String> ids = List.of("id=\"hero\"", "id=\"highlights\"", "id=\"neighbourhoods\"", "id=\"best-time\"", "id=\"plan\"");
        int last = html.indexOf("<main>");
        assertTrue(last >= 0);
        for (String id : ids) {
            int at = html.indexOf(id, last);
            assertTrue(at > last, "section out of order: " + id);
            last = at;
        }
        assertTrue(html.indexOf("<footer>") > last);
        assertEquals(5, count("<section[\\s>]"));
    }

    @Test
    void a3_noFormAndCtaHrefsAreAnchorsOrMailto() {
        assertEquals(0, count("<form[\\s>]"));
        Matcher m = Pattern.compile("<a[^>]+class=\"[^\"]*cta[^\"]*\"[^>]*href=\"([^\"]*)\"").matcher(html);
        int n = 0;
        while (m.find()) {
            n++;
            assertTrue(m.group(1).startsWith("#") || m.group(1).startsWith("mailto:"), m.group(1));
        }
        assertTrue(n >= 2);
        assertEquals(1, count("href=\"mailto:"));
    }

    @Test
    void a6_seoHead() throws Exception {
        Matcher t = Pattern.compile("<title>([^<]*)</title>").matcher(html);
        assertTrue(t.find());
        assertTrue(t.group(1).length() <= 60);
        int d = meta("name", "description").length();
        assertTrue(d >= 120 && d <= 160, "description length " + d);
        assertTrue(html.contains("<link rel=\"canonical\" href=\"https://"));
        for (String p : List.of("og:title", "og:description", "og:image")) meta("property", p);
        meta("name", "twitter:card");
        meta("name", "viewport");
        Matcher j = Pattern.compile("<script type=\"application/ld\\+json\">(.*?)</script>", Pattern.DOTALL).matcher(html);
        assertTrue(j.find());
        JsonNode node = new ObjectMapper().readTree(j.group(1));
        assertEquals("TouristDestination", node.get("@type").asText());
    }

    @Test
    void a7_landmarksAndHeadings() {
        assertEquals(1, count("<h1[\\s>]"));
        assertEquals(1, count("<header[\\s>]"));
        assertEquals(1, count("<main[\\s>]"));
        assertEquals(1, count("<footer[\\s>]"));
        Matcher m = Pattern.compile("<h([1-6])[\\s>]").matcher(html);
        List<Integer> levels = new ArrayList<>();
        while (m.find()) levels.add(Integer.parseInt(m.group(1)));
        assertEquals(1, levels.get(0));
        for (int i = 1; i < levels.size(); i++) {
            assertTrue(levels.get(i) <= levels.get(i - 1) + 1, "skipped heading level at index " + i);
        }
    }
}
