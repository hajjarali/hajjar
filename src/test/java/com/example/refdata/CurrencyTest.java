package com.example.refdata;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import cyai.validation.BeanValidationError;
import cyai.validation.IBeanContext;
import java.io.InputStream;
import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class CurrencyTest {

    private static IBeanContext context(Map<String, Object> values) {
        return (IBeanContext) Proxy.newProxyInstance(
                CurrencyTest.class.getClassLoader(), new Class<?>[] {IBeanContext.class},
                (proxy, method, args) -> {
                    if ("get".equals(method.getName())) {
                        return values.get((String) args[0]);
                    }
                    if ("getFieldValue".equals(method.getName())) {
                        return values.get((String) args[0]);
                    }
                    throw new UnsupportedOperationException(method.getName());
                });
    }

    private static List<BeanValidationError> validate(String code, String rate) {
        return new CurrencyValidator().validate(context(Map.of(
                "code", code, "rateToUsd", new BigDecimal(rate))));
    }

    @Test
    void a1_duplicateCodeIsRefusedByUniqueFlagAndConstraint() throws Exception {
        try (InputStream in = getClass().getResourceAsStream("/entity_descriptors/refdata.Currency.json")) {
            assertNotNull(in);
            JsonNode d = new ObjectMapper().readTree(in).get("descriptors").get(0);
            assertTrue(d.at("/fieldDescriptors/code/validationDescriptor/unique").asBoolean());
            assertFalse(d.at("/fieldDescriptors/code/validationDescriptor/nullable").asBoolean());
            assertEquals("code", d.at("/persistenceDescriptor/naturalKeyGroups/by_code/0").asText());
        }
    }

    @Test
    void a2_zeroOrNegativeRateIsRefused() {
        assertEquals("rateToUsd", validate("USD", "0").get(0).getField());
        assertEquals("rateToUsd", validate("USD", "-1.5").get(0).getField());
        assertTrue(validate("USD", "1.0").isEmpty());
    }

    @Test
    void codeThatIsNotThreeLettersIsRefused() {
        assertEquals("code", validate("US", "1").get(0).getField());
        assertEquals("code", validate("USDX", "1").get(0).getField());
        assertEquals("code", validate("U5D", "1").get(0).getField());
        assertTrue(validate("EUR", "1").isEmpty());
    }

    @Test
    void builderKeepsFields() {
        Currency c = Currency.builder().withCode("EUR").withName("Euro").withRateToUsd(new BigDecimal("1.08")).build();
        assertEquals("EUR", c.getCode());
        assertEquals("Euro", c.getName());
        assertEquals(new BigDecimal("1.08"), c.getRateToUsd());
    }
}
