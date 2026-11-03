package office.booking;

import cyai.entity.sheets.AbstractWritableEntityInstanceSheet;
import cyai.observer.api.sheet.annotations.Sheet;
import cyai.observer.api.sheet.entity.AccessMode;
import cyai.observer.api.sheet.entity.ServesEntity;

/**
 * The writable entity-instance sheet for {@link Booking} - the entity's only remote surface: live record, roster,
 * filtered candidate pages, upsert and delete. Booking owns no secret, so the secret seams keep their defaults.
 */
@ServesEntity(entity = Booking.class, mode = AccessMode.READ_WRITE,
        label = "Bookings",
        description = "Read and write the meeting-room bookings - live record, roster, filtered candidate pages, upsert and delete.")
@Sheet(name = BookingSheet.NAME, classVersion = 1, callerSheet = IBookingCallerSheet.NAME)
public class BookingSheet extends AbstractWritableEntityInstanceSheet {

    /** The sheet name. */
    public static final String NAME = "office.booking.Booking";

    @Override
    protected String secretApiSheetName() {
        return "office.booking.context.SecretApi";
    }
}
