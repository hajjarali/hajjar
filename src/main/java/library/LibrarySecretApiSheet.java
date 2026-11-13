package library;

import cyai.entity.sheets.AbstractSecretApiSheet;
import cyai.observer.api.sheet.annotations.Sheet;

/** The library's secret-API collaborator sheet, required by the writable entity sheet base. */
@Sheet(name = LibrarySecretApiSheet.NAME, classVersion = 1)
public class LibrarySecretApiSheet extends AbstractSecretApiSheet {

    /** The sheet name. */
    public static final String NAME = "library.context.SecretApi";
}
