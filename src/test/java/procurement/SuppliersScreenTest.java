package procurement;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cyai.testkit.view.TestViewContainer;
import cyai.uiai.elements.api.ISSElement;
import cyai.uiai.model.ApplicationModel;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class SuppliersScreenTest {

    private static Supplier supplier(long id, String name, boolean active) {
        return Supplier.builder().withId(id).withName(name).withContactEmail(name.toLowerCase() + "@x.com")
                .withCountry("FR").withActive(active).build();
    }

    @Test
    void theEntryIsRegisteredAtItsMenuPath() {
        ApplicationModel model = new ApplicationModel();
        new ProcurementApplicationModule().configure(model);

        assertNotNull(model.findNavigationNode(List.of("procurement")), "Procurement");
        assertNotNull(model.findNavigationNode(List.of("procurement", "suppliers")), "Procurement › Suppliers");
    }

    @Test
    void theScreenOpensAndRenders() throws Exception {
        try (TestViewContainer container = new TestViewContainer()) {
            SuppliersScreenModel screen = new SuppliersScreenModel("suppliers", null);
            screen.setRows(List.of(supplier(1, "Beta", true), supplier(2, "Alpha", false)));
            ISSElement<?> root = container.buildView(screen).getRootSSElement();
            assertNotNull(root.buildElementData(Map.of()), "the layout ran");
        }
    }

    @Test
    void a1_inactiveRowIsGreyedOutTheActiveOneIsNotAndBothAreListed() throws Exception {
        try (TestViewContainer container = new TestViewContainer()) {
            SuppliersScreenModel screen = new SuppliersScreenModel("suppliers", null);
            screen.setRows(List.of(supplier(1, "Beta", true), supplier(2, "Alpha", false)));

            List<SupplierRow> rows = screen.getRowsValue();
            assertEquals(2, rows.size(), "the inactive supplier is kept, not filtered out");
            assertFalse(rows.get(0).getActive(), "Alpha is inactive");
            assertTrue(rows.get(1).getActive(), "Beta is active");

            ISSElement<?> root = container.buildView(screen).getRootSSElement();
            String drawn = container.objectMapper().writeValueAsString(root.buildElementData(Map.of()));
            assertTrue(drawn.contains("Alpha") && drawn.contains("Beta"), "both rows are drawn");
            assertEquals(4, count(drawn, "text.disabled"), "only the inactive row's four cells are greyed out");
        }
    }

    @Test
    void rowsAreSortedByNameAscending() {
        SuppliersScreenModel screen = new SuppliersScreenModel("suppliers", null);
        screen.setRows(List.of(supplier(1, "charlie", true), supplier(2, "Alpha", true), supplier(3, "Bravo", false)));

        assertEquals(List.of("Alpha", "Bravo", "charlie"),
                screen.getRowsValue().stream().map(SupplierRow::getName).toList());
    }

    @Test
    void selectingARowOrChoosingAddShowsTheFormInTheSidePanel() {
        SuppliersScreenModel screen = new SuppliersScreenModel("suppliers", null);
        screen.setRows(List.of(supplier(7, "Alpha", false)));

        screen.open("7");
        assertEquals("7", screen.getSelectedKeyValue());
        assertEquals("Edit supplier", screen.getPanelTitleValue());

        screen.add();
        assertEquals("", screen.getSelectedKeyValue());
        assertEquals("New supplier", screen.getPanelTitleValue());
    }

    private static int count(String text, String part) {
        int n = 0;
        for (int i = text.indexOf(part); i >= 0; i = text.indexOf(part, i + part.length())) {
            n++;
        }
        return n;
    }
}
