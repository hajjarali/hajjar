package office.booking;

import cyai.validation.BeanValidationError;
import cyai.validation.IBeanContext;
import cyai.validation.IBeanValidator;

import java.util.List;

/**
 * Whole-bean rules of a {@link Room}: capacity is at least 1 (min(1)).
 */
public final class RoomValidator implements IBeanValidator {

    @Override
    public List<BeanValidationError> validate(IBeanContext ctx) {
        Integer capacity = ctx.get("capacity", Integer.class);
        if (capacity != null && capacity < 1) {
            return List.of(BeanValidationError.field("capacity", "Capacity must be at least 1"));
        }
        return List.of();
    }
}
