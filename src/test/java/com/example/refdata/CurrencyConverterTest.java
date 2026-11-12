package com.example.refdata;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CurrencyConverterTest {

    private final Map<String, Currency> rows = new LinkedHashMap<>();
    private final CurrencyRepository repository = new CurrencyRepository() {
        @Override
        public Optional<Currency> findByCode(String code) {
            return Optional.ofNullable(rows.get(code));
        }

        @Override
        public void save(Currency currency) {
            rows.put(currency.getCode(), currency);
        }
    };

    @BeforeEach
    void seed() {
        new CurrencySeed(repository).apply();
    }

    @Test
    void a3_convertEurToGbpAfterSeeding() {
        BigDecimal result = new CurrencyConverter(repository).convert(new BigDecimal("100"), "EUR", "GBP");
        assertEquals(new BigDecimal("85.04"), result);
    }

    @Test
    void a4_unknownCodeIsRefusedNamingIt() {
        IllegalArgumentException e = assertThrows(IllegalArgumentException.class,
                () -> new CurrencyConverter(repository).convert(BigDecimal.TEN, "XYZ", "USD"));
        assertTrue(e.getMessage().contains("XYZ"));
    }

    @Test
    void a5_seedHoldsUsdEurGbpWithTheirRates() {
        assertEquals(0, new BigDecimal("1.0").compareTo(rows.get("USD").getRateToUsd()));
        assertEquals(0, new BigDecimal("1.08").compareTo(rows.get("EUR").getRateToUsd()));
        assertEquals(0, new BigDecimal("1.27").compareTo(rows.get("GBP").getRateToUsd()));
    }

    @Test
    void applyingTheSeedTwiceLeavesExactlyThreeRows() {
        int second = new CurrencySeed(repository).apply();
        assertEquals(0, second);
        assertEquals(3, rows.size());
    }
}
