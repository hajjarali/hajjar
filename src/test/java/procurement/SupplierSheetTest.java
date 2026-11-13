package procurement;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cyai.entity.sheets.AbstractEntityInstanceSheet;
import cyai.entity.sheets.AbstractWritableEntityInstanceSheet;
import cyai.observer.api.sheet.annotations.Sheet;
import cyai.observer.api.sheet.entity.AccessMode;
import cyai.observer.api.sheet.entity.ServesEntity;
import java.lang.reflect.Method;
import org.junit.jupiter.api.Test;

class SupplierSheetTest {

    @Test
    void a1_listIsTheInheritedUnfilteredRosterSoInactiveSuppliersAreReturned() throws Exception {
        Method list = null;
        for (Method m : AbstractEntityInstanceSheet.class.getMethods()) {
            if ("list".equals(m.getName())) {
                list = m;
            }
        }
        assertNotNull(list, "the base declares the list cell");
        for (Method m : SupplierSheet.class.getDeclaredMethods()) {
            assertTrue(!"list".equals(m.getName()) && !"candidates".equals(m.getName()),
                    "the sheet must not override a read cell and filter on active: " + m.getName());
        }
        ServesEntity serves = SupplierSheet.class.getAnnotation(ServesEntity.class);
        assertEquals(Supplier.class, serves.entity());
    }

    @Test
    void sheetIsWritableSoAddedAndEditedSuppliersArePersisted() {
        assertTrue(AbstractWritableEntityInstanceSheet.class.isAssignableFrom(SupplierSheet.class));
        ServesEntity serves = SupplierSheet.class.getAnnotation(ServesEntity.class);
        assertEquals(AccessMode.READ_WRITE, serves.mode());
        Sheet sheet = SupplierSheet.class.getAnnotation(Sheet.class);
        assertEquals(ProcurementCallerSheet.NAME, sheet.callerSheet());
        assertEquals(ProcurementSecretApiSheet.NAME, new SupplierSheet().secretApiSheetName());
    }
}
