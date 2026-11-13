package procurement;

import cyai.template.model.view.AbstractTemplateView;
import cyai.uiai.elements.api.ISSElement;
import cyai.uiai.elements.impl.DynamicDivElement;
import cyai.uiai.model.AbstractModel;

/**
 * View of the Suppliers screen: a dynamic div drawn by the co-located {@code SuppliersScreenView.js}, with the
 * panel's real inputs and the screen's buttons mounted as direct children for the layout to place.
 */
public class SuppliersScreenView extends AbstractTemplateView<ISSElement<?>, SuppliersScreenModel> {

    public SuppliersScreenView(SuppliersScreenModel model) {
        super(model);
    }

    @Override
    protected ISSElement<?> createSSElement(SuppliersScreenModel model) {
        DynamicDivElement.Builder builder = buildDynamicDivElementBuilderForModel(model);
        for (AbstractModel child : model.getMountedModels()) {
            builder.withElement(getViewContainer().buildView(child).getRootSSElement());
        }
        return builder.build();
    }
}
