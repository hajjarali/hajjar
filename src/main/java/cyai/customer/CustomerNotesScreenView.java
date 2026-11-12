package cyai.customer;

import cyai.beans.model.BeanModel;
import cyai.uiai.elements.api.ISSElement;
import cyai.uiai.elements.impl.DynamicDivElement;
import cyai.uiai.view.AbstractView;

/**
 * View of the Customer notes screen: a dynamic div laid out by {@code customer-notes.screen.js}, mounting the
 * notes table, its Open / Delete actions and the side panel's Save / Cancel actions as real children. The
 * selected note's form is mounted when the model opens one and unmounted when it closes.
 */
public class CustomerNotesScreenView extends AbstractView<ISSElement<?>, CustomerNotesScreenModel> {

    /** The layout resource, without its {@code .js} suffix. */
    static final String LAYOUT = "cyai/customer/customer-notes.screen";

    /**
     * Creates the view.
     *
     * @param model the screen model
     */
    public CustomerNotesScreenView(CustomerNotesScreenModel model) {
        super(model);
    }

    @Override
    protected ISSElement<?> createSSElement(CustomerNotesScreenModel model) {
        DynamicDivElement.Builder builder = buildDynamicDivElementBuilderForModel(LAYOUT, model.getId());
        builder.withElement(getViewContainer().buildView(model.getTable()).getRootSSElement());
        builder.withElement(getViewContainer().buildView(model.getOpenButton()).getRootSSElement());
        builder.withElement(getViewContainer().buildView(model.getDeleteButton()).getRootSSElement());
        builder.withElement(getViewContainer().buildView(model.getSaveButton()).getRootSSElement());
        builder.withElement(getViewContainer().buildView(model.getCancelButton()).getRootSSElement());
        BeanModel open = model.getForm().get();
        if (open != null) {
            builder.withElement(getViewContainer().buildView(open).getRootSSElement());
        }
        return builder.build();
    }
}
