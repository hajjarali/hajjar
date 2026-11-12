package cyai.customer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import cyai.testkit.view.TestViewContainer;
import cyai.uiai.elements.api.ISSElement;
import cyai.uiai.model.ApplicationModel;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class CustomerNotesScreenTest {

    private static CustomerNote note(long id, String text, LocalDate date) {
        return CustomerNote.builder().withId(id).withCustomerName("Acme").withNoteText(text)
                .withCreatedDate(date).build();
    }

    @Test
    void theEntryIsRegisteredAtItsMenuPath() {
        ApplicationModel model = new ApplicationModel();
        new CustomerApplicationModule().configure(model);

        assertNotNull(model.findNavigationNode(List.of("customers", "customer-notes")),
                "Customers > Customer notes");
    }

    @Test
    void theScreenOpensAndRenders() throws Exception {
        try (TestViewContainer container = new TestViewContainer()) {
            CustomerNotesScreenModel screen = new CustomerNotesScreenModel("customer-notes",
                    (ICustomerNoteSheetClient) null);
            ISSElement<?> root = container.buildView(screen).getRootSSElement();
            assertNotNull(root.buildElementData(Map.of()), "the layout ran");
        }
    }

    @Test
    void a2_theTableShowsTheNewerOfTwoSavedNotesFirst() {
        CustomerNotesTableModel table = new CustomerNotesTableModel("t");
        CustomerNote older = note(1, "first", LocalDate.of(2026, 1, 1));
        CustomerNote newer = note(2, "second", LocalDate.of(2026, 2, 1));

        table.showRows(List.of(older, newer));

        assertEquals(2, table.getData().size());
        assertEquals("2", table.getData().get(0).getId());
        assertEquals("1", table.getData().get(1).getId());
    }
}
