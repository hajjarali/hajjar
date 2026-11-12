package com.example.refdata;

import cyai.template.model.view.AbstractTemplateView;
import cyai.uiai.elements.api.ISSElement;

/** View of {@link CurrenciesScreenModel}: a dynamic div drawn by the co-located {@code CurrenciesScreenView.js}. */
public class CurrenciesScreenView extends AbstractTemplateView<ISSElement<?>, CurrenciesScreenModel> {

    public CurrenciesScreenView(CurrenciesScreenModel model) {
        super(model);
    }

    @Override
    protected ISSElement<?> createSSElement(CurrenciesScreenModel model) {
        return buildDynamicDivElementBuilderForModel(model)
                .withVariable("rows", model.getRows())
                .build();
    }
}
