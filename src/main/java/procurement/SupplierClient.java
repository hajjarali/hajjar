package procurement;

import cyai.common.concurrent.futures.ICompletableFuture;
import cyai.observer.api.ScopeType;
import cyai.observer.api.client.IWatchRegistration;
import cyai.observer.api.client.annotations.Evaluate;
import cyai.observer.api.client.annotations.SheetClient;
import cyai.observer.api.client.annotations.WatchCell;
import cyai.observer.api.sheet.entity.IEntityInstanceSheet;
import java.util.function.Consumer;

/** The typed client of {@link SupplierSheet}: the Suppliers screen reads and saves its rows through it. */
@SheetClient(value = SupplierSheet.NAME, classVersion = 1)
public interface SupplierClient {

    /** Binds the caller's supplier list live; every delivery carries all rows, inactive ones included. */
    @WatchCell(cell = IEntityInstanceSheet.LIST, scope = ScopeType.PRINCIPAL)
    IWatchRegistration watchList(Consumer<Object> onRows);

    /** Upserts one supplier (insert when new, update when it exists) and answers the saved row. */
    @Evaluate(cell = IEntityInstanceSheet.SAVE, seed = IEntityInstanceSheet.SAVE_INPUT)
    ICompletableFuture<Object> save(Object supplier);
}
