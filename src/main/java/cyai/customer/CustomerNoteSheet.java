package cyai.customer;

import cyai.entity.sheets.AbstractWritableEntityInstanceSheet;
import cyai.entitymgr.IEntityManagers;
import cyai.observer.api.observer.annotations.Impure;
import cyai.observer.api.observer.annotations.ObserverIdArg;
import cyai.observer.api.sheet.annotations.Cell;
import cyai.observer.api.sheet.annotations.CellProviderArg;
import cyai.observer.api.sheet.annotations.Sheet;
import cyai.observer.api.sheet.caller.CallerArg;
import cyai.observer.api.sheet.caller.CallerPart;
import cyai.observer.api.sheet.entity.AccessMode;
import cyai.observer.api.sheet.entity.ServesEntity;
import cyai.query.dao.DaoException;
import cyai.query.dao.ICallerSession;
import java.util.List;

/** The observer sheet of CustomerNote: its only remote surface, reads and writes, newest note first. */
@ServesEntity(entity = CustomerNote.class, mode = AccessMode.READ_WRITE,
        label = "Customer notes",
        description = "Read and write customer notes; the list is ordered by created date, newest first.")
@Sheet(name = CustomerNoteSheet.NAME, classVersion = 1, callerSheet = CustomerCallerSheet.NAME)
public class CustomerNoteSheet extends AbstractWritableEntityInstanceSheet {

    /** The sheet name. */
    public static final String NAME = "customer.CustomerNote";

    /** The field the list is ordered by, descending. */
    static final String ORDER_FIELD = "createdDate";

    @Override
    protected String secretApiSheetName() {
        return CustomerSecretApiSheet.NAME;
    }

    /** All notes of the caller's tenant, newest first by created date. */
    @Impure
    @Cell
    @Override
    public List<?> list(@ObserverIdArg Object callId,
                        @CallerArg(CallerPart.SESSION) ICallerSession caller,
                        @CellProviderArg("managers") IEntityManagers managers,
                        @CellProviderArg("permissions") Object permissions) throws DaoException {
        return newestFirst(managers, caller);
    }

    /** The notes of the caller, ordered by created date descending. */
    static List<CustomerNote> newestFirst(IEntityManagers managers, ICallerSession caller) throws DaoException {
        return managers.of(CustomerNote.class, caller).query().orderByDesc(ORDER_FIELD).list();
    }
}
