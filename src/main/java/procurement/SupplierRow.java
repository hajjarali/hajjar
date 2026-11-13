package procurement;

/** One line of the Suppliers table: a supplier as the layout reads it. Immutable. */
public final class SupplierRow {

    private final Supplier supplier;

    SupplierRow(Supplier supplier) {
        this.supplier = supplier;
    }

    Supplier supplier() {
        return supplier;
    }

    /** @return the row key the layout dispatches on a click — the supplier id */
    public String getKey() {
        return String.valueOf(supplier.getId());
    }

    public String getName() {
        return supplier.getName() == null ? "" : supplier.getName();
    }

    public String getContactEmail() {
        return supplier.getContactEmail() == null ? "" : supplier.getContactEmail();
    }

    public String getCountry() {
        return supplier.getCountry() == null ? "" : supplier.getCountry();
    }

    /** @return whether the supplier is active; an inactive row is drawn greyed out, never dropped */
    public boolean getActive() {
        return Boolean.TRUE.equals(supplier.getActive());
    }
}
