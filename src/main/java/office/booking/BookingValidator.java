package office.booking;

import cyai.entity.desc.view.ReadWriteMode;
import cyai.validation.BeanValidationError;
import cyai.validation.IBeanContext;
import cyai.validation.IBeanValidator;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Gates every {@link Booking} save with the single-field rules (email format, attendees at least 1) and the rules
 * of {@link BookingRules}: the time window, the room's capacity and the status of a new booking. The form calls
 * this synchronously, so it holds only what the working copy and the already-bound room can answer; the checks
 * that need other rows (the confirmed-overlap test) run on the save path, see {@link BookingRules#overlapsConfirmed}.
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
        String window = BookingRules.timeWindowProblem(
                ctx.get("startTime", LocalDateTime.class), ctx.get("endTime", LocalDateTime.class));
        if (window != null) {
            errors.add(BeanValidationError.field("endTime", window));
        }
        String capacity = BookingRules.capacityProblem(attendees, roomCapacity(ctx));
        if (capacity != null) {
            errors.add(BeanValidationError.field("attendees", capacity));
        }
        if (ctx.mode() == ReadWriteMode.INSERT) {
            String transition = BookingRules.transitionProblem(null, ctx.get("status", BookingStatus.class));
            if (transition != null) {
                errors.add(BeanValidationError.field("status", transition));
            }
        }
        return errors;
    }

    /** The capacity of the booking's room, or {@code null} when the room is unset or cannot be read here. */
    private static Integer roomCapacity(IBeanContext ctx) {
        Object bean = ctx.bean();
        if (!(bean instanceof Booking booking) || booking.getRoom() == null) {
            return null;
        }
        try {
            Room room = booking.getRoom().resolve();
            return room == null ? null : room.getCapacity();
        } catch (Exception | IllegalStateException e) {
            return null; // not resolvable on this path: the save path re-checks with the row in hand
        }
    }
}
