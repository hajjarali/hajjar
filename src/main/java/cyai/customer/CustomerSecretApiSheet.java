package cyai.customer;

import cyai.entity.sheets.AbstractSecretApiSheet;
import cyai.observer.api.sheet.annotations.Sheet;

/** The secret-API collaborator sheet the writable CustomerNote sheet's save/delete cells resolve. */
@Sheet(name = CustomerSecretApiSheet.NAME, classVersion = 1)
public class CustomerSecretApiSheet extends AbstractSecretApiSheet {

    /** The sheet name. */
    public static final String NAME = "customer.context.SecretApi";
}
