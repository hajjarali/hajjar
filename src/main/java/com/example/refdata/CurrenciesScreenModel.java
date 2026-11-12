package com.example.refdata;

import cyai.uiai.model.AbstractModel;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * The Currencies screen: a table of currencies (code, name, rateToUsd) with the selected row's default form in a
 * side panel. The layout is the co-located {@code CurrenciesScreenView.js}, drawn from the spec mock
 * {@code ui/currencies.screen.js}; it reads {@link #getRows()}.
 */
public class CurrenciesScreenModel extends AbstractModel {

    private final String id;
    private final List<Map<String, String>> rows = new ArrayList<>();

    /** Reflection-probe constructor for the model interceptor — never used to build a live screen. */
    public CurrenciesScreenModel() {
        this("probe");
    }

    /** Test-seam constructor: no sheet client, no rows. */
    public CurrenciesScreenModel(String id) {
        super(CurrenciesScreenView.class);
        this.id = id;
    }

    public String getId() {
        return id;
    }

    /** The rows the table shows: one map per currency with code, name and rateToUsd. */
    public List<Map<String, String>> getRows() {
        return rows;
    }

    /** Replaces the rows the table shows; set before the view is built. */
    public void setRows(List<Map<String, String>> newRows) {
        rows.clear();
        rows.addAll(newRows);
    }

    @Override
    protected void internalClose() {
        // owns nothing to release
    }
}
