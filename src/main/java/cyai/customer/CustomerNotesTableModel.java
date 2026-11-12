package cyai.customer;

import cyai.uiai.data.grid.GridColumnData;
import cyai.uiai.data.grid.GridRowData;
import cyai.uiai.model.Action;
import cyai.uiai.model.ActionParameter;
import cyai.uiai.model.grid.AbstractDataTableModel;
import cyai.uiai.model.grid.TableCellRef;
import cyai.uiai.model.grid.TableLoadEvent;
import cyai.uiai.model.grid.TableMenuClickEvent;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

/**
 * The platform's standard data table over the saved notes: customerName, noteText and createdDate, newest first.
 * Rows are pushed in by the screen ({@link #showRows}); the table loads nothing itself.
 */
public class CustomerNotesTableModel extends AbstractDataTableModel {

    /** Column key of the customer name. */
    public static final String COL_CUSTOMER_NAME = "customerName";
    /** Column key of the note text. */
    public static final String COL_NOTE_TEXT = "noteText";
    /** Column key of the created date. */
    public static final String COL_CREATED_DATE = "createdDate";

    private final Map<String, CustomerNote> notesById = new LinkedHashMap<>();
    private Consumer<CustomerNote> onNoteSelected;

    /** Probe constructor for the model interceptor. */
    public CustomerNotesTableModel() {
        this("customerNotesTable");
    }

    /**
     * Creates the table.
     *
     * @param id the model id
     */
    public CustomerNotesTableModel(String id) {
        super(id);
        getColumns().add(this, 0, column(COL_CUSTOMER_NAME, "Customer name"));
        getColumns().add(this, 1, column(COL_NOTE_TEXT, "Note text"));
        getColumns().add(this, 2, column(COL_CREATED_DATE, "Created date"));
        getRowSelection().set(this, true);
        getSelectedCells().addChangeListener((writer, property, oldValue, newValue) -> notifySelected(newValue));
    }

    private static GridColumnData column(String key, String name) {
        return new GridColumnData.Builder(key).withName(name).build();
    }

    /**
     * Registers who hears the selected note.
     *
     * @param listener the listener
     */
    public void setOnNoteSelected(Consumer<CustomerNote> listener) {
        this.onNoteSelected = listener;
    }

    /**
     * Replaces the table's rows, newest created date first (a note with no date goes last).
     *
     * @param notes the notes to show
     */
    public void showRows(List<CustomerNote> notes) {
        List<CustomerNote> ordered = new ArrayList<>(notes);
        ordered.sort(Comparator.comparing(CustomerNote::getCreatedDate,
                Comparator.nullsLast(Comparator.<LocalDate>reverseOrder())));
        notesById.clear();
        getData().clear(this);
        int index = 0;
        for (CustomerNote note : ordered) {
            String rowId = String.valueOf(note.getId());
            notesById.put(rowId, note);
            GridRowData row = new GridRowData.Builder(rowId)
                    .withCellData(COL_CUSTOMER_NAME, text(note.getCustomerName()))
                    .withCellData(COL_NOTE_TEXT, text(note.getNoteText()))
                    .withCellData(COL_CREATED_DATE, text(note.getCreatedDate()))
                    .build();
            getData().add(this, index++, row);
        }
    }

    /**
     * The note whose row is selected.
     *
     * @param rowId the row id
     * @return the note, or {@code null}
     */
    public CustomerNote noteOf(String rowId) {
        return notesById.get(rowId);
    }

    /**
     * The first selected note.
     *
     * @return the selected note, or {@code null} when nothing is selected
     */
    public CustomerNote selectedNote() {
        List<TableCellRef> cells = getSelectedCells().get();
        if (cells == null || cells.isEmpty()) {
            return null;
        }
        return notesById.get(cells.get(0).rowId());
    }

    private void notifySelected(List<TableCellRef> cells) {
        if (onNoteSelected == null || cells == null || cells.isEmpty()) {
            return;
        }
        CustomerNote note = notesById.get(cells.get(0).rowId());
        if (note != null) {
            onNoteSelected.accept(note);
        }
    }

    private static String text(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    @Override
    @Action(name = "onLoad", description = "Rows are pushed by the screen; nothing to load")
    public void onLoad(@ActionParameter(value = "event", description = "the load request") TableLoadEvent event) {
        // all rows are pushed by showRows
    }

    @Override
    @Action(name = "onCellEdit", description = "The table is read-only")
    public void onCellEdit(@ActionParameter("value") Object value, @ActionParameter("position") Integer position,
                           @ActionParameter("col") String col) {
        // the table is read-only; notes are edited in the side panel
    }

    @Override
    @Action(name = "onMenuClick", description = "No row menu")
    public void onMenuClick(@ActionParameter("event") TableMenuClickEvent event) {
        // no row menu: Open is a row selection, Delete is the table region's button
    }

    @Override
    protected int getTotalItemCount() {
        return notesById.size();
    }

    @Override
    protected void closeGrid() {
        notesById.clear();
    }
}
