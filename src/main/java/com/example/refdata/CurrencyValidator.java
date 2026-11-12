package com.example.refdata;

import cyai.validation.BeanValidationError;
import cyai.validation.IBeanContext;
import cyai.validation.IBeanValidator;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/** Save-time rules of {@link Currency}: a 3-letter code and a rate strictly greater than 0. */
public final class CurrencyValidator implements IBeanValidator {

    @Override
    public List<BeanValidationError> validate(IBeanContext ctx) {
        List<BeanValidationError> errors = new ArrayList<>();
        String code = ctx.get("code", String.class);
        if (code != null && !isThreeLetters(code)) {
            errors.add(BeanValidationError.field("code", "Code must be exactly 3 letters"));
        }
        BigDecimal rate = ctx.get("rateToUsd", BigDecimal.class);
        if (rate != null && rate.signum() <= 0) {
            errors.add(BeanValidationError.field("rateToUsd", "Rate to USD must be greater than 0"));
        }
        return errors;
    }

    static boolean isThreeLetters(String code) {
        return code.length() == 3 && code.chars().allMatch(Character::isLetter);
    }
}
