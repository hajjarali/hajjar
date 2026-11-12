package com.example.refdata;

import cyai.observer.api.sheet.annotations.Sheet;
import cyai.observer.api.sheet.entity.AccessMode;
import cyai.observer.api.sheet.entity.ServesEntity;

/** The writable entity-instance sheet for {@link Currency}: reads, listing, save and delete. */
@ServesEntity(entity = Currency.class, mode = AccessMode.READ_WRITE,
        label = "Currencies",
        description = "Read and write currencies and their rate to USD - live record, roster, filtered pages, upsert and delete.")
@Sheet(name = CurrencySheet.NAME, classVersion = 1, callerSheet = CurrencySheet.CALLER_SHEET)
public class CurrencySheet extends AbstractRefdataEntityInstanceSheet {

    /** The sheet name. */
    public static final String NAME = "refdata.Currency";

    /** The refdata caller sheet this sheet reads its caller session from. */
    public static final String CALLER_SHEET = "refdata.context.Caller";
}
