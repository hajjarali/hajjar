package procurement;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;
import cyai.common.json.IJsonObject;
import cyai.common.json.JsonTypesLoader;
import cyai.validation.BeanValidationError;
import cyai.validation.IBeanContext;
import java.lang.reflect.Proxy;
import java.util.List;
import org.junit.jupiter.api.Test;

class SupplierTest {

    private static ObjectMapper mapper() throws Exception {
        return new JsonTypesLoader.Builder().withClassLoader(SupplierTest.class.getClassLoader()).build()
                .getObjectMapper();
    }

    private static IBeanContext contextWithEmail(String email) {
        return (IBeanContext) Proxy.newProxyInstance(IBeanContext.class.getClassLoader(),
                new Class<?>[] {IBeanContext.class}, (proxy, method, args) -> {
                    if ("getFieldValue".equals(method.getName())) {
                        return email;
                    }
                    return null;
                });
    }

    @Test
    void a1_inactiveSupplierRoundTripsWithActiveFalse() throws Exception {
        Supplier inactive = Supplier.builder().withName("Acme").withActive(false).build();
        ObjectMapper mapper = mapper();
        String json = mapper.writeValueAsString(inactive);
        assertTrue(json.contains("\"jsontype\":\"procurement.supplier\""));
        Supplier back = (Supplier) mapper.readValue(json, IJsonObject.class);
        assertEquals(Boolean.FALSE, back.getActive());
        assertEquals("Acme", back.getName());
    }

    @Test
    void builderKeepsAllFields() {
        Supplier s = Supplier.builder().withName("Acme").withContactEmail("a@b.com").withCountry("FR")
                .withActive(true).build();
        assertEquals("a@b.com", s.getContactEmail());
        assertEquals("FR", s.getCountry());
        assertEquals(Boolean.TRUE, s.getActive());
    }

    @Test
    void malformedContactEmailIsRefused() {
        List<BeanValidationError> errors = new SupplierValidator().validate(contextWithEmail("not-an-email"));
        assertEquals(1, errors.size());
        assertEquals("contactEmail", errors.get(0).getField());
        assertTrue(errors.get(0).isBlocking());
    }

    @Test
    void validOrEmptyContactEmailIsAccepted() {
        assertTrue(new SupplierValidator().validate(contextWithEmail("buyer@acme.com")).isEmpty());
        assertTrue(new SupplierValidator().validate(contextWithEmail(null)).isEmpty());
        assertTrue(new SupplierValidator().validate(contextWithEmail("")).isEmpty());
        assertFalse(SupplierValidator.isValidEmail("a@b"));
    }

    @Test
    void nameAndActiveAreRequiredInTheDescriptor() throws Exception {
        String json = new String(getClass().getResourceAsStream("/cyai/entity/desc/entity_descriptors.json")
                .readAllBytes());
        assertTrue(json.contains("procurement.Supplier"));
    }
}
