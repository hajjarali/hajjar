package com.example.beirut;

import static org.junit.jupiter.api.Assertions.*;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class PageContentTest {

    static String html;

    @BeforeAll
    static void load() throws IOException {
        try (InputStream in = PageContentTest.class.getResourceAsStream("/beirut.html")) {
            assertNotNull(in);
            html = new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private static boolean has(String tag, String attr) {
        return Pattern.compile("\\s" + attr + "=\"[^\"]+\"").matcher(tag).find();
    }

    @Test
    void a8_everyImageHasAltSizeAndNonHeroImagesAreLazy() {
        Matcher m = Pattern.compile("<img\\b[^>]*>").matcher(html);
        int n = 0;
        int lazy = 0;
        while (m.find()) {
            n++;
            String tag = m.group();
            assertTrue(has(tag, "alt"), tag);
            assertTrue(has(tag, "width"), tag);
            assertTrue(has(tag, "height"), tag);
            if (tag.contains("loading=\"lazy\"")) lazy++;
        }
        assertTrue(n >= 8);
        assertEquals(n - 1, lazy, "all images except the hero must be lazy");
        int hero = html.indexOf("id=\"hero\"");
        int heroImg = html.indexOf("<img", hero);
        int heroEnd = html.indexOf("</section>", hero);
        assertTrue(heroImg > hero && heroImg < heroEnd);
        assertFalse(html.substring(heroImg, html.indexOf('>', heroImg)).contains("loading=\"lazy\""));
    }

    @Test
    void a9_everyImageContainerHasGradientAndErrorHandler() {
        Matcher m = Pattern.compile("<img\\b[^>]*>").matcher(html);
        while (m.find()) {
            assertTrue(m.group().contains("onerror=\"this.style.display='none'\""), m.group());
        }
        Matcher c = Pattern.compile("<div class=\"photo[^\"]*\"><img|<div class=\"photo[^\"]*\">\\s*<img").matcher(html);
        int containers = 0;
        while (c.find()) containers++;
        assertEquals(count("<img\\b"), containers);
        assertTrue(Pattern.compile("\\.photo\\s*\\{[^}]*linear-gradient").matcher(html).find());
    }

    private static int count(String regex) {
        Matcher m = Pattern.compile(regex).matcher(html);
        int n = 0;
        while (m.find()) n++;
        return n;
    }

    @Test
    void sectionsCarryI18nKeys() {
        assertTrue(count("data-i18n=\"highlights\\.(history|food|culture|seaside)\\.title\"") == 4);
        assertTrue(count("data-i18n=\"neighbourhoods\\.") >= 7);
        assertTrue(count("data-i18n=\"besttime\\.") >= 7);
    }
}
