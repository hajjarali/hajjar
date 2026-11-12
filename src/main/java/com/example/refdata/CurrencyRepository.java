package com.example.refdata;

import java.util.Optional;

/** The storage seam of the currency operations: lookup by code and insert. */
public interface CurrencyRepository {

    /** The currency stored under {@code code}, if any. */
    Optional<Currency> findByCode(String code);

    /** Stores a new currency. */
    void save(Currency currency);
}
