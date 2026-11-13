package library;

import cyai.validation.BeanValidationError;
import cyai.validation.IBeanContext;
import cyai.validation.IBeanValidator;
import java.util.ArrayList;
import java.util.List;

/** Form-level rules of {@link Book}: rating within 1..5. */
public final class BookValidator implements IBeanValidator {

    @Override
    public List<BeanValidationError> validate(IBeanContext ctx) {
        List<BeanValidationError> errors = new ArrayList<>();
        Integer rating = ctx.get("rating", Integer.class);
        if (rating != null && (rating < Book.MIN_RATING || rating > Book.MAX_RATING)) {
            errors.add(BeanValidationError.field("rating",
                    "Rating must be between " + Book.MIN_RATING + " and " + Book.MAX_RATING));
        }
        return errors;
    }
}
