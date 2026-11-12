package com.example.refdata;

import java.math.BigDecimal;
import java.util.List;

/** Idempotent seed of USD, EUR and GBP: a code already present is skipped. */
public final class CurrencySeed {

    private static final List<Currency> ROWS = List.of(
            row("USD", "US Dollar", "1.0"),
            row("EUR", "Euro", "1.08"),
            row("GBP", "British Pound", "1.27"));

    private final CurrencyRepository repository;

    public CurrencySeed(CurrencyRepository repository) {
        this.repository = repository;
    }

    /** Inserts the missing seed rows; returns how many were inserted. */
    public int apply() {
        int inserted = 0;
        for (Currency row : ROWS) {
            if (repository.findByCode(row.getCode()).isEmpty()) {
                repository.save(row);
                inserted++;
            }
        }
        return inserted;
    }

    private static Currency row(String code, String name, String rate) {
        return Currency.builder().withCode(code).withName(name).withRateToUsd(new BigDecimal(rate)).build();
    }
}
