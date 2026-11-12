package com.example.refdata;

import cyai.entity.sheets.AbstractWritableEntityInstanceSheet;

/** Refdata adapter of the writable entity-instance base: names the domain's secret-API sheet. */
public abstract class AbstractRefdataEntityInstanceSheet extends AbstractWritableEntityInstanceSheet {

    /** Name of the refdata secret-API collaborator sheet. */
    public static final String SECRET_API_SHEET = "refdata.context.SecretApi";

    @Override
    protected String secretApiSheetName() {
        return SECRET_API_SHEET;
    }
}
