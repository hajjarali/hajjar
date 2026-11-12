package cyai.customer;

import cyai.entity.desc.view.Icon;
import cyai.observer.api.client.IObserverClientSet;
import cyai.uiai.model.ApplicationModel;
import cyai.uiai.model.IApplicationModule;
import java.util.List;

/** Application module of the customer domain: registers Customers › Customer notes. */
public final class CustomerApplicationModule implements IApplicationModule {

    /** The module name. */
    public static final String NAME = "customer";

    /** The shared group node id. */
    static final String CUSTOMERS_NODE = "customers";

    /** The navigation leaf id — also the tab id and the parent id the screen scopes its own id under. */
    static final String CUSTOMER_NOTES_NODE = "customer-notes";

    /** Service-loader constructor. */
    public CustomerApplicationModule() {
        // nothing to inject: the screen borrows its sheet client from the tab's client set
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void configure(ApplicationModel model) {
        IObserverClientSet clients = model.getObserverClients();
        model.ensureNavigationGroup(List.of(), CUSTOMERS_NODE, "Customers", Icon.COLLECTIONS);
        model.addNavigationNode(List.of(CUSTOMERS_NODE), CUSTOMER_NOTES_NODE, "Customer notes", Icon.DESCRIPTION,
                true, () -> new CustomerNotesScreenModel(CUSTOMER_NOTES_NODE, clients));
    }

    @Override
    public void close() {
        // no owned resources
    }
}
