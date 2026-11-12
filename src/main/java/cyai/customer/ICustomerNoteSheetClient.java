package cyai.customer;

import cyai.common.concurrent.futures.ICompletableFuture;
import cyai.observer.api.client.IWatchRegistration;
import cyai.observer.api.client.annotations.Evaluate;
import cyai.observer.api.client.annotations.SheetClient;
import cyai.observer.api.client.annotations.WatchCell;
import cyai.observer.api.observer.annotations.ObserverIdArg;
import cyai.observer.api.sheet.entity.IEntityInstanceSheet;
import java.util.function.Consumer;

/** The typed client of {@link CustomerNoteSheet}: the Customer notes screen's only data plane. */
@SheetClient(value = CustomerNoteSheet.NAME, classVersion = 1)
public interface ICustomerNoteSheetClient {

    /**
     * Binds the caller's notes live, newest first.
     *
     * @param onRows receives the row list on every delivery
     * @return the subscription handle
     */
    @WatchCell(cell = IEntityInstanceSheet.LIST)
    IWatchRegistration watchList(Consumer<Object> onRows);

    /**
     * Re-reads the list so the standing watch re-delivers.
     *
     * @param scopeId the scope-resolved id
     * @return the (ignored) future
     */
    @Evaluate(cell = IEntityInstanceSheet.LIST)
    ICompletableFuture<Object> reevaluateList(@ObserverIdArg Object scopeId);

    /**
     * Deletes one note.
     *
     * @param subjectId the row id
     * @return the future of the deleted id
     */
    @Evaluate(cell = IEntityInstanceSheet.DELETE, seed = IEntityInstanceSheet.SUBJECT)
    ICompletableFuture<Object> delete(Object subjectId);

    /**
     * Saves one note (insert or update).
     *
     * @param note the note
     * @return the future of the saved row
     */
    @Evaluate(cell = IEntityInstanceSheet.SAVE, seed = IEntityInstanceSheet.SAVE_INPUT)
    ICompletableFuture<Object> save(CustomerNote note);
}
