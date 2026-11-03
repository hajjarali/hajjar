package office.booking;

import cyai.entity.sheets.AbstractWritableEntityInstanceSheet;
import cyai.observer.api.sheet.annotations.Sheet;
import cyai.observer.api.sheet.entity.AccessMode;
import cyai.observer.api.sheet.entity.ServesEntity;

/**
 * The writable entity-instance sheet for {@link Room} - the entity's only remote surface: live record, roster,
 * filtered candidate pages, upsert and delete. Room owns no secret, so the secret seams keep their defaults.
 */
@ServesEntity(entity = Room.class, mode = AccessMode.READ_WRITE,
        label = "Rooms",
        description = "Read and write the bookable meeting rooms - live record, roster, filtered candidate pages, upsert and delete.")
@Sheet(name = RoomSheet.NAME, classVersion = 1, callerSheet = IBookingCallerSheet.NAME)
public class RoomSheet extends AbstractWritableEntityInstanceSheet {

    /** The sheet name. */
    public static final String NAME = "office.booking.Room";

    @Override
    protected String secretApiSheetName() {
        return "office.booking.context.SecretApi";
    }
}
