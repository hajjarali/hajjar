package procurement;

import cyai.entity.sheets.AbstractCallerSheet;
import cyai.observer.api.sheet.annotations.Sheet;

/** The caller sheet of the procurement store: the sessions its entity sheets read and write through. */
@Sheet(name = ProcurementCallerSheet.NAME, classVersion = 1, store = "procurement")
public class ProcurementCallerSheet extends AbstractCallerSheet {

    /** The sheet name. */
    public static final String NAME = "procurement.context.Caller";

    @Override
    protected String sheetName() {
        return NAME;
    }
}
