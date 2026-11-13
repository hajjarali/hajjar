package procurement;

import cyai.entity.desc.view.Icon;
import cyai.observer.api.client.IObserverClientSet;
import cyai.uiai.model.ApplicationModel;
import cyai.uiai.model.IApplicationModule;
import java.util.List;

/** Registers the Suppliers screen in the navigation, under Procurement › Suppliers. */
public final class ProcurementApplicationModule implements IApplicationModule {

    /** The module name. */
    public static final String NAME = "procurement";

    private static final String GROUP_NODE = "procurement";
    private static final String SUPPLIERS_NODE = "suppliers";

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void configure(ApplicationModel model) {
        IObserverClientSet clients = model.getObserverClients();   // this tab's set; the screen borrows from it
        model.ensureNavigationGroup(List.of(), GROUP_NODE, "Procurement", Icon.INVENTORY_2);
        model.addNavigationNode(List.of(GROUP_NODE), SUPPLIERS_NODE, "Suppliers", Icon.PERSON, true,
                () -> new SuppliersScreenModel(SUPPLIERS_NODE, clients));
    }

    @Override
    public void close() {
        // No owned resources — the screen closes its own watch with itself.
    }
}
