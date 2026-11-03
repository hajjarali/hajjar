package com.example.beirut;

import static org.junit.jupiter.api.Assertions.*;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class PageStyleTest {

    static String html;
    static String css;

    @BeforeAll
    static void load() throws IOException {
        try (InputStream in = PageStyleTest.class.getResourceAsStream("/beirut.html")) {
            assertNotNull(in);
            html = new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
        css = html.substring(html.indexOf("<style>"), html.indexOf("</style>"));
    }

    private static String colour(String name) {
        Matcher m = Pattern.compile("--" + name + ":\\s*(#[0-9a-fA-F]{6})").matcher(css);
        assertTrue(m.find(), name);
        return m.group(1);
    }

    private static double lum(String hex) {
        double[] c = new double[3];
        for (int i = 0; i < 3; i++) {
            double v = Integer.parseInt(hex.substring(1 + 2 * i, 3 + 2 * i), 16) / 255.0;
            c[i] = v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        }
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    }

    private static double ratio(String a, String b) {
        double x = lum(a), y = lum(b);
        return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    }

    @Test
    void a10_paletteContrastIsAtLeast4_5() {
        assertTrue(ratio(colour("ink"), colour("sand")) >= 4.5);
        assertTrue(ratio(colour("ink"), "#ffffff") >= 4.5);
        assertTrue(ratio("#ffffff", colour("sea")) >= 4.5);
        assertTrue(ratio("#ffffff", colour("terracotta")) >= 4.5);
        assertTrue(ratio(colour("sea"), colour("sand")) >= 4.5);
        assertTrue(ratio(colour("sea"), "#ffffff") >= 4.5);
        assertTrue(ratio("#ffffff", "#8a3119") >= 4.5);
    }

    @Test
    void a10_focusVisibleRuleExists() {
        assertTrue(Pattern.compile("a:focus-visible,\\s*button:focus-visible\\s*\\{[^}]*outline:\\s*3px").matcher(css).find());
    }

    @Test
    void a10_animationsAreGatedByReducedMotion() {
        int gate = css.indexOf("@media (prefers-reduced-motion: no-preference)");
        assertTrue(gate > 0);
        String before = css.substring(0, gate);
        assertFalse(before.contains("animation:"), "animation outside the gate");
        assertFalse(before.contains("@keyframes"));
        assertTrue(css.contains("@media (prefers-reduced-motion: reduce)"));
        assertTrue(html.contains("(prefers-reduced-motion: no-preference)\").matches"));
    }

    @Test
    void a5_wrappingGridAndMediaQueries() {
        assertTrue(css.contains("repeat(auto-fit, minmax(min(100%, 16rem), 1fr))"));
        assertTrue(css.contains("clamp("));
        assertTrue(css.contains("overflow-wrap: anywhere"));
        assertTrue(css.contains("@media (max-width: 480px)"));
        assertTrue(css.contains("@media (min-width: 768px)"));
        assertTrue(css.contains("@media (min-width: 1280px)"));
        assertTrue(css.contains("flex-wrap: wrap"));
        assertTrue(css.contains("scroll-behavior: smooth"));
    }
}
