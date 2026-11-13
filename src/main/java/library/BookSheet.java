package library;

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
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/** The observer sheet of {@link Book}: reads and writes, the list sorted by rating, best first. */
@ServesEntity(entity = Book.class, mode = AccessMode.READ_WRITE,
        label = "Books",
        description = "Read and write the library's books - the list is sorted by rating, best first, unrated last.")
@Sheet(name = BookSheet.NAME, classVersion = 1, callerSheet = LibraryCallerSheet.NAME)
public class BookSheet extends AbstractWritableEntityInstanceSheet {

    /** The sheet name. */
    public static final String NAME = "library.Book";

    @Override
    protected String secretApiSheetName() {
        return LibrarySecretApiSheet.NAME;
    }

    /**
     * All books of the caller's tenant, best rating first; books without a rating come last.
     */
    @Override
    @Cell
    @Impure
    public List<?> list(@ObserverIdArg Object callId,
                        @CallerArg(CallerPart.SESSION) ICallerSession caller,
                        @CellProviderArg("managers") IEntityManagers managers,
                        @CellProviderArg("permissions") Object permissions) throws DaoException {
        return sortByRatingDescending(managers.of(Book.class, caller).findAll());
    }

    /**
     * Sorts books by rating, highest first, unrated last; equal ratings keep their given order.
     *
     * @param books the books to sort
     * @return a new sorted list
     */
    public static List<Book> sortByRatingDescending(List<Book> books) {
        List<Book> sorted = new ArrayList<>(books);
        sorted.sort(Comparator.comparing(Book::getRating, Comparator.nullsLast(Comparator.reverseOrder())));
        return sorted;
    }
}
