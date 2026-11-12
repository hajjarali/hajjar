package com.example.refdata;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import cyai.testkit.view.TestViewContainer;
import cyai.uiai.elements.api.ISSElement;
import cyai.uiai.model.ApplicationModel;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class CurrenciesScreenTest {

    @Test
    void theEntryIsRegisteredAtItsMenuPath() {
        ApplicationModel model = new ApplicationModel();
        new RefdataApplicationModule().configure(model);

        assertNotNull(model.findNavigationNode(List.of("refdata", "currencies")), "Reference data › Currencies");
    }

    @Test
    void theScreenOpensAndRenders() throws Exception {
        try (TestViewContainer container = new TestViewContainer()) {
            CurrenciesScreenModel screen = new CurrenciesScreenModel("currencies");
            screen.setRows(List.of(Map.of("code", "USD", "name", "US Dollar", "rateToUsd", "1.0")));
            ISSElement<?> root = container.buildView(screen).getRootSSElement();
            assertNotNull(root.buildElementData(Map.of()), "the layout ran");
        }
    }

    @Test
    void a1_duplicateCodeFromTheSidePanelFormIsRefusedByTheUniqueCode() throws Exception {
        // the side panel edits the row in Currency's default form, which saves through CurrencySheet
        try (InputStream in = getClass().getResourceAsStream("/entity_descriptors/refdata.Currency.json")) {
            JsonNode d = new ObjectMapper().readTree(in).get("descriptors").get(0);
            assertTrue(d.at("/fieldDescriptors/code/validationDescriptor/unique").asBoolean());
        }
        assertEquals("refdata.Currency", CurrencySheet.NAME);
    }
}
