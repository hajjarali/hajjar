package procurement;

import cyai.common.concurrent.futures.ISuccessFailureConsumer;
import cyai.entity.desc.view.Size;
import cyai.observer.api.client.IObserverClientSet;
import cyai.observer.api.client.IWatchRegistration;
import cyai.uiai.data.buttons.ButtonVariant;
import cyai.uiai.model.AbstractModel;
import cyai.uiai.model.IModelContainer;
import cyai.uiai.model.buttons.ActionButtonModel;
import cyai.uiai.model.inputs.SwitchModel;
import cyai.uiai.model.inputs.text.TextFieldModel;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * The Suppliers screen: a table of every supplier sorted by name (an inactive row is greyed out by the layout and
 * never filtered out) beside a side panel holding the selected or new supplier's form, with save and cancel.
 * Rows are read live, and saved, through {@link SupplierClient} — the {@link SupplierSheet} proxy.
 *
 * <p>The layout ({@code SuppliersScreenView.js}) reads a snapshot, so every change of the rows, the selection or
 * the panel mode calls {@code redraw()}; the panel's field values are bound elements and move without one.</p>
 */
public class SuppliersScreenModel extends AbstractModel {

    private static final String ID = "suppliersScreen";
    private static final String DEFAULT_PARENT = "suppliers";

    private final String id;
    private final SupplierClient client;
    private final TextFieldModel nameField;
    private final TextFieldModel emailField;
    private final TextFieldModel countryField;
    private final SwitchModel activeSwitch;
    private final TextFieldModel selectConduit;
    private final ActionButtonModel addButton;
    private final ActionButtonModel openButton;
    private final ActionButtonModel saveButton;
    private final ActionButtonModel cancelButton;
    private final List<AbstractModel> mounted;
    private List<SupplierRow> rows = new ArrayList<>();
    private Supplier selected;
    private IWatchRegistration watch;

    /** Reflection-probe constructor for the model interceptor — never used to build a live screen. */
    public SuppliersScreenModel() {
        this(DEFAULT_PARENT, (IObserverClientSet) null);
    }

    /**
     * @param parentId the navigation node id — this model's id is scoped under it
     * @param clients  the tab's observer client set; {@code null} (a standalone shell, a test) builds an
     *                 unconnected screen that lists nothing
     */
    public SuppliersScreenModel(String parentId, IObserverClientSet clients) {
        this(parentId, clients == null ? null : clients.client(SupplierClient.class), true);
    }

    /** Test seam: injects the typed client directly. */
    SuppliersScreenModel(String parentId, SupplierClient client, boolean seam) {
        super(SuppliersScreenView.class);
        this.id = parentId + "_" + ID;
        this.client = client;
        this.nameField = field("name", "Name");
        this.emailField = field("contactEmail", "Contact Email");
        this.countryField = field("country", "Country");
        this.activeSwitch = new SwitchModel(fieldNameToModelId("active"));
        this.activeSwitch.getLabel().set(this, "Active");
        this.activeSwitch.getValue().set(this, true);
        this.selectConduit = new TextFieldModel(fieldNameToModelId("selectConduit"));
        this.selectConduit.getValue().addChangeListener((writer, property, oldValue, newValue) -> {
            if (newValue != null) {
                String key = newValue;
                this.selectConduit.getValue().set(this, null);
                open(key);
            }
        });
        this.addButton = button("addButton", "Add supplier", ButtonVariant.CONTAINED, this::add);
        this.openButton = button("openButton", "Open", ButtonVariant.OUTLINED, this::openSelected);
        this.saveButton = button("saveButton", "Save", ButtonVariant.CONTAINED, this::save);
        this.cancelButton = button("cancelButton", "Cancel", ButtonVariant.OUTLINED, this::cancel);
        this.mounted = List.of(nameField, emailField, countryField, activeSwitch, selectConduit,
                addButton, openButton, saveButton, cancelButton);
    }

    private TextFieldModel field(String name, String label) {
        TextFieldModel f = new TextFieldModel(fieldNameToModelId(name));
        f.getLabel().set(this, label);
        return f;
    }

    private ActionButtonModel button(String name, String label, ButtonVariant variant, Runnable onClick) {
        return new ActionButtonModel.Builder(fieldNameToModelId(name)).withLabel(label).withVariant(variant)
                .withSize(Size.SMALL).withOnClick(onClick).build();
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    protected void connect(IModelContainer modelContainer) {
        super.connect(modelContainer);
        if (client != null && watch == null) {
            watch = client.watchList(value -> asyncExecuteInSession("Suppliers list delivered", () -> setRows(value)));
        }
    }

    @Override
    protected void internalClose() {
        if (watch != null) {
            watch.close();
            watch = null;
        }
        for (AbstractModel child : mounted) {
            child.close();
        }
    }

    // --- what the view and the layout read ---

    /** @return the models the view mounts as direct children of the layout's div */
    List<AbstractModel> getMountedModels() {
        return mounted;
    }

    /** @return every supplier, inactive ones included, sorted by name ascending (layout value accessor) */
    public List<SupplierRow> getRowsValue() {
        return rows;
    }

    /** @return the selected supplier's key, or {@code ""} for none (layout value accessor) */
    public String getSelectedKeyValue() {
        return selected == null ? "" : String.valueOf(selected.getId());
    }

    /** @return the side panel's title (layout value accessor) */
    public String getPanelTitleValue() {
        return selected == null ? "New supplier" : "Edit supplier";
    }

    // --- data in ---

    /** Replaces the rows with a delivery of the sheet's list: every row, sorted by name. */
    void setRows(Object delivered) {
        List<Supplier> suppliers = new ArrayList<>();
        if (delivered instanceof Iterable<?> items) {
            for (Object item : items) {
                if (item instanceof Supplier s) {
                    suppliers.add(s);
                }
            }
        }
        applyRows(suppliers);
    }

    private void applyRows(List<Supplier> suppliers) {
        List<SupplierRow> next = new ArrayList<>();
        for (Supplier s : suppliers) {
            next.add(new SupplierRow(s));
        }
        next.sort(Comparator.comparing((SupplierRow r) -> r.getName().toLowerCase()).thenComparing(SupplierRow::getKey));
        this.rows = next;
        redraw();
    }

    // --- actions ---

    /** Opens the side panel on a blank, new supplier. */
    void add() {
        selected = null;
        fill(null);
        redraw();
    }

    /** Opens the selected supplier in the side panel (a no-op while none is selected). */
    void openSelected() {
        if (selected != null) {
            fill(selected);
            redraw();
        }
    }

    /** Selects the supplier whose id is {@code key} and shows it in the side panel. */
    void open(String key) {
        for (SupplierRow row : rows) {
            if (row.getKey().equals(key)) {
                selected = row.supplier();
                fill(selected);
                redraw();
                return;
            }
        }
    }

    /** Drops the unsaved edits: the panel shows the selected supplier again, or a blank one. */
    void cancel() {
        fill(selected);
        redraw();
    }

    /** Saves the panel's supplier — an insert when new, an update when one is selected. */
    void save() {
        clearErrors();
        String name = blankToNull(nameField.getValue().get());
        String email = blankToNull(emailField.getValue().get());
        boolean valid = true;
        if (name == null) {
            fail(nameField, "Name is required");
            valid = false;
        }
        if (!SupplierValidator.isValidEmail(email)) {
            fail(emailField, "Enter a valid email address");
            valid = false;
        }
        if (!valid || client == null) {
            return;
        }
        Supplier.Builder builder = selected == null ? Supplier.builder() : Supplier.builder().copyFrom(selected);
        Supplier bean = builder.withName(name).withContactEmail(email)
                .withCountry(blankToNull(countryField.getValue().get()))
                .withActive(Boolean.TRUE.equals(activeSwitch.getValue().get())).build();
        client.save(bean).whenComplete(new ISuccessFailureConsumer<Object>() {
            @Override
            public void success(Object saved) {
                asyncExecuteInSession("Supplier saved", () -> saved(saved));
            }

            @Override
            public void failure(Throwable cause) {
                asyncExecuteInSession("Supplier not saved", () -> {
                    var bell = notifications();
                    if (bell != null) {
                        bell.notifyError("Supplier not saved", "The supplier could not be saved.", cause);
                    }
                });
            }
        });
    }

    private void saved(Object row) {
        if (row instanceof Supplier s) {
            List<Supplier> all = new ArrayList<>();
            for (SupplierRow existing : rows) {
                if (!existing.getKey().equals(String.valueOf(s.getId()))) {
                    all.add(existing.supplier());
                }
            }
            all.add(s);
            selected = s;
            applyRows(all);
        }
    }

    private void fill(Supplier supplier) {
        clearErrors();
        nameField.getValue().set(this, supplier == null ? null : supplier.getName());
        emailField.getValue().set(this, supplier == null ? null : supplier.getContactEmail());
        countryField.getValue().set(this, supplier == null ? null : supplier.getCountry());
        activeSwitch.getValue().set(this, supplier == null || Boolean.TRUE.equals(supplier.getActive()));
    }

    private void clearErrors() {
        for (TextFieldModel f : List.of(nameField, emailField)) {
            f.getError().set(this, false);
            f.getErrorMessage().set(this, null);
        }
    }

    private void fail(TextFieldModel field, String message) {
        field.getError().set(this, true);
        field.getErrorMessage().set(this, message);
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
