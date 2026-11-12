package cyai.customer;

import cyai.validation.BeanValidationError;
import cyai.validation.IBeanContext;
import cyai.validation.IBeanValidator;
import java.util.List;

/** Gives the refusal for a missing note text a readable sentence. */
public final class CustomerNoteValidator implements IBeanValidator {

    /** The message shown when the note text is missing. */
    public static final String NOTE_TEXT_REQUIRED = "Please enter the note text.";

    @Override
    public List<BeanValidationError> validate(IBeanContext ctx) {
        Object text = ctx.getFieldValue("noteText");
        if (text == null || text.toString().isBlank()) {
            return List.of(BeanValidationError.field("noteText", NOTE_TEXT_REQUIRED));
        }
        return List.of();
    }
}
