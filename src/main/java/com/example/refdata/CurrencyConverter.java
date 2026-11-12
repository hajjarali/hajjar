package com.example.refdata;

import java.math.BigDecimal;
import java.math.RoundingMode;

/** Converts amounts between currencies through their stored rate to USD. */
public final class CurrencyConverter {

    private final CurrencyRepository repository;

    public CurrencyConverter(CurrencyRepository repository) {
        this.repository = repository;
    }

    /**
     * Returns {@code amount × rateToUsd(fromCode) ÷ rateToUsd(toCode)}, rounded HALF_UP to 2 decimals
     * (rounded once, on the final result).
     *
     * @throws IllegalArgumentException when a code matches no currency; the message names the code
     */
    public BigDecimal convert(BigDecimal amount, String fromCode, String toCode) {
        BigDecimal from = rateOf(fromCode);
        BigDecimal to = rateOf(toCode);
        return amount.multiply(from).divide(to, 2, RoundingMode.HALF_UP);
    }

    private BigDecimal rateOf(String code) {
        return repository.findByCode(code)
                .map(Currency::getRateToUsd)
                .orElseThrow(() -> new IllegalArgumentException("Unknown currency code: " + code));
    }
}
