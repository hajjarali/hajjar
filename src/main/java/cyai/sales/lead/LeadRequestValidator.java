package cyai.sales.lead;

import cyai.validation.BeanValidationError;
import cyai.validation.IBeanContext;
import cyai.validation.IBeanValidator;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/** Enforces the email-address format on save (required-ness comes from the descriptor's nullable flags). */
public final class LeadRequestValidator implements IBeanValidator {

    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    /**
     * Whether the text is a valid email address.
     *
     * @param email the candidate
     * @return true when well-formed
     */
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL.matcher(email.trim()).matches();
    }

    @Override
    public List<BeanValidationError> validate(IBeanContext ctx) {
        List<BeanValidationError> errors = new ArrayList<>();
        String email = ctx.get("email", String.class);
        if (email != null && !email.isBlank() && !isValidEmail(email)) {
            errors.add(BeanValidationError.field("email", "Enter a valid email address"));
        }
        return errors;
    }
}
