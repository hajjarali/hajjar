package cyai.sales.lead;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cyai.validation.BeanValidationError;
import cyai.validation.IBeanContext;
import java.lang.reflect.Proxy;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class LeadRequestTest {

    private static IBeanContext contextOf(Map<String, Object> values) {
        return (IBeanContext) Proxy.newProxyInstance(
                IBeanContext.class.getClassLoader(),
                new Class<?>[] {IBeanContext.class},
                (proxy, method, args) -> {
                    if ("get".equals(method.getName())) {
                        return values.get((String) args[0]);
                    }
                    if ("getFieldValue".equals(method.getName())) {
                        return values.get((String) args[0]);
                    }
                    return null;
                });
    }

    private static List<BeanValidationError> validate(String email) {
        Map<String, Object> values = new java.util.HashMap<>();
        values.put("email", email);
        return new LeadRequestValidator().validate(contextOf(values));
    }

    @Test
    void savedLeadRequestHasStatusNewByDefault() {
        LeadRequest lead = LeadRequest.builder()
                .withFullName("Ann")
                .withEmail("a@b.com")
                .withRequestType(RequestType.QUOTE)
                .build();
        assertEquals(LeadRequestStatus.NEW, lead.getStatus());
    }

    @Test
    void explicitStatusIsKept() {
        LeadRequest lead = LeadRequest.builder().withStatus(LeadRequestStatus.CLOSED).build();
        assertEquals(LeadRequestStatus.CLOSED, lead.getStatus());
    }

    @Test
    void invalidEmailIsRefused() {
        List<BeanValidationError> errors = validate("abc");
        assertEquals(1, errors.size());
        assertEquals("email", errors.get(0).getField());
        assertTrue(errors.get(0).isBlocking());
    }

    @Test
    void validEmailIsAccepted() {
        assertTrue(validate("a@b.com").isEmpty());
        assertFalse(LeadRequestValidator.isValidEmail(null));
    }

    @Test
    void fullNameAndRequestTypeAreRequiredInTheDescriptor() throws Exception {
        String json = Files.readString(
                Path.of("src/main/resources/cyai/sales/lead/sales.lead.LeadRequest.json"), StandardCharsets.UTF_8);
        for (String field : List.of("fullName", "email", "requestType", "status")) {
            int at = json.indexOf("\"" + field + "\" : {");
            assertTrue(at >= 0, field);
            int nullable = json.indexOf("\"nullable\"", at);
            assertEquals("\"nullable\" : false", json.substring(nullable, nullable + 18), field + " is required");
        }
        assertNotNull(LeadRequest.ENTITY_CLASS_KEY);
    }

    @Test
    void enumsCarryTheSpecValues() {
        assertEquals(List.of("TEST_DRIVE", "QUOTE"),
                List.of(RequestType.values()).stream().map(Enum::name).toList());
        assertEquals(List.of("NEW", "CONTACTED", "CLOSED"),
                List.of(LeadRequestStatus.values()).stream().map(Enum::name).toList());
    }
}
