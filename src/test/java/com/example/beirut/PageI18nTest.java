package com.example.beirut;

import static org.junit.jupiter.api.Assertions.*;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class PageI18nTest {

    static String html;

    @BeforeAll
    static void load() throws IOException {
        try (InputStream in = PageI18nTest.class.getResourceAsStream("/beirut.html")) {
            assertNotNull(in);
            html = new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private static Set<String> keysUsed() {
        Set<String> keys = new HashSet<>();
        Matcher m = Pattern.compile("data-i18n(?:-alt|-aria)?=\"([^\"]+)\"").matcher(html);
        while (m.find()) keys.add(m.group(1));
        return keys;
    }

    private static String block(String lang, String next) {
        int s = html.indexOf("\n    " + lang + ": {");
        assertTrue(s >= 0, "no dictionary for " + lang);
        int e = next == null ? html.indexOf("\n  };", s) : html.indexOf("\n    " + next + ": {", s);
        return html.substring(s, e);
    }

    @Test
    void a4_everyKeyHasEnglishAndArabicEntry() {
        String en = block("en", "ar");
        String ar = block("ar", null);
        Set<String> keys = keysUsed();
        assertTrue(keys.size() > 30);
        for (String k : keys) {
            assertTrue(en.contains("\"" + k + "\":"), "en missing " + k);
            assertTrue(ar.contains("\"" + k + "\":"), "ar missing " + k);
        }
    }

    @Test
    void a4_arabicEntriesContainArabicScriptExceptBrandNames() {
        String ar = block("ar", null);
        Matcher m = Pattern.compile("\"([a-z.]+)\": \"([^\"]*)\"").matcher(ar);
        while (m.find()) {
            if (m.group(1).equals("toggle.label")) continue;
            assertTrue(Pattern.compile("[\\u0600-\\u06FF]").matcher(m.group(2)).find(), m.group(1));
            assertFalse(Pattern.compile("(?i)\\bcorniche\\b").matcher(m.group(2)).find(), m.group(1));
        }
    }

    @Test
    void a4_toggleSetsLangAndDirBothWays() {
        assertTrue(html.contains("id=\"lang-toggle\""));
        assertTrue(html.contains("root.setAttribute(\"lang\", lang)"));
        assertTrue(html.contains("lang === \"ar\" ? \"rtl\" : \"ltr\""));
        assertTrue(html.contains("getAttribute(\"lang\") === \"ar\" ? \"en\" : \"ar\""));
    }

    @Test
    void a4_noPhysicalLeftRightPropertiesInStyles() {
        int s = html.indexOf("<style>");
        String css = html.substring(s, html.indexOf("</style>"));
        assertFalse(Pattern.compile("(margin|padding|border)-(left|right)|\\b(left|right)\\s*:|text-align\\s*:\\s*(left|right)|float\\s*:").matcher(css).find());
    }
}
