package com.example.refdata;

import cyai.entity.desc.view.Icon;
import cyai.uiai.model.ApplicationModel;
import cyai.uiai.model.IApplicationModule;
import java.util.List;

/** Registers the Currencies screen under Reference data › Currencies. */
public final class RefdataApplicationModule implements IApplicationModule {

    public static final String NAME = "refdata";
    static final String GROUP_ID = "refdata";
    static final String CURRENCIES_ID = "currencies";

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void configure(ApplicationModel model) {
        model.ensureNavigationGroup(List.of(), GROUP_ID, "Reference data", Icon.DESCRIPTION);
        model.addNavigationNode(List.of(GROUP_ID), CURRENCIES_ID, "Currencies", Icon.DESCRIPTION, true,
                () -> new CurrenciesScreenModel(CURRENCIES_ID));
    }

    @Override
    public void close() {
        // nothing opened
    }
}
