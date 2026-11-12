package cyai.customer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import cyai.validation.BeanValidationError;
import cyai.validation.IBeanContext;
import java.io.InputStream;
import java.lang.reflect.Proxy;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class CustomerNoteTest {

    private static IBeanContext contextWith(Map<String, Object> values) {
        return (IBeanContext) Proxy.newProxyInstance(
                IBeanContext.class.getClassLoader(),
                new Class<?>[] {IBeanContext.class},
                (proxy, method, args) -> {
                    if ("getFieldValue".equals(method.getName())) {
                        return values.get((String) args[0]);
                    }
                    throw new UnsupportedOperationException(method.getName());
                });
    }

    private static JsonNode field(String name) throws Exception {
        try (InputStream in = CustomerNoteTest.class.getResourceAsStream(
                "/entity_descriptors/customer.CustomerNote.json")) {
            return new ObjectMapper().readTree(in).get("descriptors").get(0)
                    .get("fieldDescriptors").get(name);
        }
    }

    @Test
    void a1_savingWithoutCustomerNameIsRefused() throws Exception {
        assertFalse(field("customerName").get("validationDescriptor").get("nullable").asBoolean(true));
    }

    @Test
    void a1_savingWithoutNoteTextIsRefused() throws Exception {
        assertFalse(field("noteText").get("validationDescriptor").get("nullable").asBoolean(true));
        List<BeanValidationError> errors =
                new CustomerNoteValidator().validate(contextWith(Map.of("customerName", "Acme")));
        assertEquals(1, errors.size());
        assertTrue(errors.get(0).isBlocking());
    }

    @Test
    void a4_missingNoteTextRefusalIsAReadableSentence() {
        List<BeanValidationError> errors = new CustomerNoteValidator()
                .validate(contextWith(Map.of("customerName", "Acme", "noteText", "  ")));
        assertEquals(1, errors.size());
        assertEquals("Please enter the note text.", CustomerNoteValidator.NOTE_TEXT_REQUIRED);
        assertTrue(errors.get(0).toString().contains("Please enter the note text."));
    }

    @Test
    void validNoteHasNoFindings() {
        assertTrue(new CustomerNoteValidator()
                .validate(contextWith(Map.of("customerName", "Acme", "noteText", "Called"))).isEmpty());
    }
}
