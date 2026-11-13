package library;

import cyai.entity.sheets.AbstractCallerSheet;
import cyai.observer.api.sheet.annotations.Sheet;

/** The library's caller sheet: the caller sessions of the library store. */
@Sheet(name = LibraryCallerSheet.NAME, classVersion = 1, store = "library")
public class LibraryCallerSheet extends AbstractCallerSheet {

    /** The sheet name. */
    public static final String NAME = "library.context.Caller";

    @Override
    protected String sheetName() {
        return NAME;
    }
}
