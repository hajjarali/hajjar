package procurement;

import cyai.entity.sheets.AbstractWritableEntityInstanceSheet;
import cyai.observer.api.sheet.annotations.Sheet;
import cyai.observer.api.sheet.entity.AccessMode;
import cyai.observer.api.sheet.entity.ServesEntity;

/**
 * The writable entity sheet for {@code Supplier} — its only remote surface. The inherited {@code list} cell returns
 * every supplier of the caller's tenant, inactive ones included; nothing here filters on {@code active}.
 */
@ServesEntity(entity = Supplier.class, mode = AccessMode.READ_WRITE,
        label = "Suppliers",
        description = "Read and write the supplier register - every supplier, active or not, with upsert and delete.")
@Sheet(name = SupplierSheet.NAME, classVersion = 1, callerSheet = ProcurementCallerSheet.NAME)
public class SupplierSheet extends AbstractWritableEntityInstanceSheet {

    /** The sheet name. */
    public static final String NAME = "procurement.Supplier";

    @Override
    protected String secretApiSheetName() {
        return ProcurementSecretApiSheet.NAME;
    }
}
