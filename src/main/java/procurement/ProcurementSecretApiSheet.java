package procurement;

import cyai.entity.sheets.AbstractSecretApiSheet;
import cyai.observer.api.sheet.annotations.Sheet;

/** The secret-API collaborator sheet the writable procurement sheets name (no supplier field is a secret). */
@Sheet(name = ProcurementSecretApiSheet.NAME, classVersion = 1)
public class ProcurementSecretApiSheet extends AbstractSecretApiSheet {

    /** The sheet name. */
    public static final String NAME = "procurement.context.SecretApi";
}
