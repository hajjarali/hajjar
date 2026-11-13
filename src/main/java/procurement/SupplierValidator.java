package procurement;

import cyai.validation.BeanValidationError;
import cyai.validation.IBeanContext;
import cyai.validation.IBeanValidator;
import java.util.List;
import java.util.regex.Pattern;

/** Enforces the email-address format of a supplier's contactEmail (an empty one is accepted). */
public final class SupplierValidator implements IBeanValidator {

    private static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s.]+(\\.[^@\\s.]+)+$");

    /** Whether the value is empty or a well-formed email address. */
    public static boolean isValidEmail(String value) {
        return value == null || value.isBlank() || EMAIL.matcher(value.trim()).matches();
    }

    @Override
    public List<BeanValidationError> validate(IBeanContext ctx) {
        Object value = ctx.getFieldValue("contactEmail");
        String text = value == null ? null : value.toString();
        if (isValidEmail(text)) {
            return List.of();
        }
        return List.of(BeanValidationError.field("contactEmail", "Enter a valid email address"));
    }
}
