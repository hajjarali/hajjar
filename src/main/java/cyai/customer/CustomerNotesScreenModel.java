package cyai.customer;

import cyai.beans.model.BeanModel;
import cyai.entity.view.ReadWriteMode;
import cyai.observer.api.ScopeType;
import cyai.observer.api.client.IObserverClientSet;
import cyai.observer.api.client.IWatchRegistration;
import cyai.observer.client.command.ScopeIdRef;
import cyai.uiai.model.AbstractModel;
import cyai.uiai.model.IModelContainer;
import cyai.uiai.model.buttons.ActionButtonModel;
import cyai.uiai.property.IObjectProperty;
import java.util.ArrayList;
import java.util.List;

/**
 * The Customer notes screen: a standard data table of the saved notes, newest first, beside a side panel holding
 * the selected note's default form. Reads and writes go through {@link ICustomerNoteSheetClient} only.
 */
public class CustomerNotesScreenModel extends AbstractModel {

    private static final String ID = "customerNotes";

    private final String id;
    private final ICustomerNoteSheetClient sheet;
    private final CustomerNotesTableModel table;
    private final ActionButtonModel openButton;
    private final ActionButtonModel deleteButton;
    private final ActionButtonModel saveButton;
    private final ActionButtonModel cancelButton;
    private final IObjectProperty<BeanModel> form;
    private IWatchRegistration listWatch;

    /** Probe constructor for the model interceptor — never used to build a live screen. */
    public CustomerNotesScreenModel() {
        this(ID, (ICustomerNoteSheetClient) null);
    }

    /**
     * Creates the screen over the tab's observer client set.
     *
     * @param parentId the navigation node id — this screen's id is parent-scoped
     * @param clients  the tab's observer client set; {@code null} builds an unconnected screen
     */
    public CustomerNotesScreenModel(String parentId, IObserverClientSet clients) {
        this(parentId, clients == null ? null : clients.client(ICustomerNoteSheetClient.class));
    }

    /**
     * Test seam: injects the typed sheet client directly.
     *
     * @param parentId the navigation node id
     * @param sheet    the sheet client, or {@code null}
     */
    CustomerNotesScreenModel(String parentId, ICustomerNoteSheetClient sheet) {
        super(CustomerNotesScreenView.class);
        this.id = fieldNameToModelId(parentId, ID);
        this.sheet = sheet;
        this.table = new CustomerNotesTableModel(id + "_table");
        this.openButton = button(id + "_open", "Open", this::openSelected);
        this.deleteButton = button(id + "_delete", "Delete", this::deleteSelected);
        this.saveButton = button(id + "_save", "Save", this::saveForm);
        this.cancelButton = button(id + "_cancel", "Cancel", this::cancelForm);
        this.form = newObjectProperty("form", null);
        this.table.setOnNoteSelected(this::showForm);
    }

    private static ActionButtonModel button(String buttonId, String label, Runnable onClick) {
        return new ActionButtonModel.Builder(buttonId).withLabel(label).withOnClick(onClick).build();
    }

    private static String fieldNameToModelId(String parentId, String suffix) {
        return parentId + "_" + suffix;
    }

    /** @return the screen id */
    public String getId() {
        return id;
    }

    /** @return the element id the side panel's form is mounted under */
    public String getFormId() {
        return id + "_noteForm";
    }

    /** @return the notes table */
    public CustomerNotesTableModel getTable() {
        return table;
    }

    /** @return the Open action of the table region */
    public ActionButtonModel getOpenButton() {
        return openButton;
    }

    /** @return the Delete action of the table region */
    public ActionButtonModel getDeleteButton() {
        return deleteButton;
    }

    /** @return the Save action of the side panel */
    public ActionButtonModel getSaveButton() {
        return saveButton;
    }

    /** @return the Cancel action of the side panel */
    public ActionButtonModel getCancelButton() {
        return cancelButton;
    }

    /** @return the selected note's default form, reactive; its value is {@code null} while nothing is open */
    public IObjectProperty<BeanModel> getForm() {
        return form;
    }

    @Override
    protected void connect(IModelContainer modelContainer) {
        if (sheet != null) {
            listWatch = sheet.watchList(rows -> inSession(() -> showRows(rows)));
        }
    }

    /**
     * Shows the rows a sheet delivery carried.
     *
     * @param rows the delivered rows
     */
    @SuppressWarnings("unchecked")
    void showRows(Object rows) {
        List<CustomerNote> notes = new ArrayList<>();
        if (rows instanceof List<?> list) {
            for (Object row : list) {
                if (row instanceof CustomerNote note) {
                    notes.add(note);
                }
            }
        }
        table.showRows(notes);
    }

    private void inSession(Runnable work) {
        asyncExecuteInSession("Customer notes rows", work);
    }

    private void refresh() {
        if (sheet != null) {
            sheet.reevaluateList(ScopeIdRef.of(ScopeType.PRINCIPAL));
        }
    }

    private void openSelected() {
        CustomerNote note = table.selectedNote();
        if (note != null) {
            showForm(note);
        }
    }

    private void deleteSelected() {
        CustomerNote note = table.selectedNote();
        if (note == null || sheet == null) {
            return;
        }
        sheet.delete(note.getId()).whenComplete(new cyai.common.concurrent.futures.ISuccessFailureConsumer<Object>() {
            @Override
            public void success(Object deletedId) {
                inSession(() -> {
                    cancelForm();
                    refresh();
                });
            }

            @Override
            public void failure(Throwable cause) {
                inSession(() -> notifications().notifyError("Note not deleted",
                        "The customer note could not be deleted.", cause));
            }
        });
    }

    private void saveForm() {
        BeanModel current = form.get();
        if (current == null || sheet == null) {
            return;
        }
        sheet.save((CustomerNote) current.getBean())
                .whenComplete(new cyai.common.concurrent.futures.ISuccessFailureConsumer<Object>() {
                    @Override
                    public void success(Object saved) {
                        inSession(() -> {
                            cancelForm();
                            refresh();
                        });
                    }

                    @Override
                    public void failure(Throwable cause) {
                        inSession(() -> notifications().notifyError("Note not saved",
                                "The customer note could not be saved.", cause));
                    }
                });
    }

    private void cancelForm() {
        form.set(this, null);
        redraw();
    }

    /**
     * Puts the note's default form in the side panel.
     *
     * @param note the note to show
     */
    void showForm(CustomerNote note) {
        if (getModelContainer() == null) {
            return;
        }
        BeanModel next = BeanModel.builder(getFormId(), CustomerNote.class, note)
                .readWriteMode(ReadWriteMode.UPDATE).build();
        form.set(this, next);
        redraw();
    }

    @Override
    protected void internalClose() {
        if (listWatch != null) {
            listWatch.close();
            listWatch = null;
        }
    }
}
