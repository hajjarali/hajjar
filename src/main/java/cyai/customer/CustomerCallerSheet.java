package cyai.customer;

import cyai.entity.sheets.AbstractCallerSheet;
import cyai.observer.api.sheet.annotations.Sheet;

/** The caller sheet of the customer domain: names the store CustomerNote lives in. */
@Sheet(name = CustomerCallerSheet.NAME, classVersion = CustomerCallerSheet.CLASS_VERSION, store = "customers")
public class CustomerCallerSheet extends AbstractCallerSheet {

    /** The sheet name. */
    public static final String NAME = "customer.context.Caller";

    /** The sheet class version. */
    public static final int CLASS_VERSION = 1;

    @Override
    protected String sheetName() {
        return NAME;
    }
}
