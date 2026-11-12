package com.example.refdata;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;
import cyai.entity.AbstractRdbmsEntity;
import java.math.BigDecimal;
import java.util.Objects;

/** A currency with its exchange rate to USD, used to convert amounts. */
@JsonDeserialize(builder = Currency.Builder.class)
public final class Currency extends AbstractRdbmsEntity<Currency> {

    private final String code;
    private final String name;
    private final BigDecimal rateToUsd;

    private Currency(Builder builder) {
        super(builder);
        this.code = builder.code;
        this.name = builder.name;
        this.rateToUsd = builder.rateToUsd;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getRateToUsd() {
        return rateToUsd;
    }

    @Override
    public Currency copy(long newId) {
        return builder().withId(newId).withUid(getUid()).withCreatedAt(getCreatedAt())
                .withUpdatedAt(getUpdatedAt()).withTenantId(getTenantId())
                .withCode(code).withName(name).withRateToUsd(rateToUsd).build();
    }

    @Override
    protected String internalToString() {
        return "code=" + code + ", name=" + name + ", rateToUsd=" + rateToUsd;
    }

    @Override
    protected int internalHashCode() {
        return Objects.hash(code, name, rateToUsd);
    }

    @Override
    protected boolean internalEquals(Currency o) {
        return Objects.equals(code, o.code)
                && Objects.equals(name, o.name)
                && Objects.equals(rateToUsd, o.rateToUsd);
    }

    @JsonPOJOBuilder(withPrefix = "with")
    public static final class Builder extends AbstractRdbmsEntity.AbstractBuilder<Currency, Builder> {
        private String code;
        private String name;
        private BigDecimal rateToUsd;

        public Builder withCode(String code) {
            this.code = code;
            return this;
        }

        public Builder withName(String name) {
            this.name = name;
            return this;
        }

        public Builder withRateToUsd(BigDecimal rateToUsd) {
            this.rateToUsd = rateToUsd;
            return this;
        }

        @Override
        public Currency build() {
            return new Currency(this);
        }
    }
}
