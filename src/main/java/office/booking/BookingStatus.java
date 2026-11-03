package office.booking;

import com.fasterxml.jackson.annotation.JsonTypeName;
import cyai.common.json.enums.IDisplayableEnum;

/**
 * Where a booking stands: requested, confirmed or cancelled (the states of {@code Booking.status}).
 */
@JsonTypeName("office.booking.bookingStatus")
public enum BookingStatus implements IDisplayableEnum {
    REQUESTED("requested", "Requested"),
    CONFIRMED("confirmed", "Confirmed"),
    CANCELLED("cancelled", "Cancelled");

    private final String value;
    private final String label;

    BookingStatus(String value, String label) {
        this.value = value;
        this.label = label;
    }

    @Override
    public String getValue() {
        return value;
    }

    @Override
    public String getLabel() {
        return label;
    }
}
