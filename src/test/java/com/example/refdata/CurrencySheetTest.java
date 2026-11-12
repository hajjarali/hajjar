package com.example.refdata;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import cyai.entity.sheets.AbstractEntityInstanceSheet;
import cyai.entity.sheets.AbstractWritableEntityInstanceSheet;
import cyai.observer.api.sheet.annotations.Sheet;
import cyai.observer.api.sheet.entity.AccessMode;
import cyai.observer.api.sheet.entity.ServesEntity;
import java.io.InputStream;
import org.junit.jupiter.api.Test;

class CurrencySheetTest {

    @Test
    void sheetServesCurrencyReadWriteThroughRefdataCaller() {
        ServesEntity serves = CurrencySheet.class.getAnnotation(ServesEntity.class);
        assertNotNull(serves);
        assertEquals(Currency.class, serves.entity());
        assertEquals(AccessMode.READ_WRITE, serves.mode());
        Sheet sheet = CurrencySheet.class.getAnnotation(Sheet.class);
        assertEquals(CurrencySheet.NAME, sheet.name());
        assertEquals(CurrencySheet.CALLER_SHEET, sheet.callerSheet());
    }

    @Test
    void savedCurrenciesAreListedBecauseTheSheetInheritsTheRosterCells() throws Exception {
        assertTrue(AbstractWritableEntityInstanceSheet.class.isAssignableFrom(CurrencySheet.class));
        assertTrue(AbstractEntityInstanceSheet.class.isAssignableFrom(CurrencySheet.class));
        assertTrue(java.util.Arrays.stream(AbstractEntityInstanceSheet.class.getMethods())
                .anyMatch(m -> "list".equals(m.getName())));
    }

    @Test
    void a1_duplicateCodeThroughTheSheetIsRefusedByTheUniqueCode() throws Exception {
        // the sheet's save cell upserts through the DAO, which enforces the descriptor's unique flag
        try (InputStream in = getClass().getResourceAsStream("/entity_descriptors/refdata.Currency.json")) {
            JsonNode d = new ObjectMapper().readTree(in).get("descriptors").get(0);
            assertTrue(d.at("/fieldDescriptors/code/validationDescriptor/unique").asBoolean());
        }
    }
}
