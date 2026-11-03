package office.booking;

import cyai.validation.BeanValidationError;
import cyai.validation.IBeanContext;
import cyai.validation.IBeanValidator;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Rules of a {@link Booking}. This step holds the declarative single-field rules: the organiser's email is a
 * well-formed address and attendees is at least 1. The cross-field rules (time window, capacity, status
 * transitions, overlap) are added to this class by the rules task.
 */
public final class BookingValidator implements IBeanValidator {

    private static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    @Override
    public List<BeanValidationError> validate(IBeanContext ctx) {
        List<BeanValidationError> errors = new ArrayList<>();
        String email = ctx.get("organiserEmail", String.class);
        if (email != null && !EMAIL.matcher(email).matches()) {
            errors.add(BeanValidationError.field("organiserEmail", "Enter a valid email address"));
        }
        Integer attendees = ctx.get("attendees", Integer.class);
        if (attendees != null && attendees < 1) {
            errors.add(BeanValidationError.field("attendees", "Attendees must be at least 1"));
        }
        return errors;
    }
}
