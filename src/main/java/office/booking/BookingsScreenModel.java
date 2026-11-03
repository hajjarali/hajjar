package office.booking;

import cyai.entity.model.explorer.EntityExplorerTabModel;
import cyai.observer.client.surface.ISurfaceCatalogs;

/**
 * The Bookings screen: a list of Bookings with open, delete and new, and the selected Booking's default form
 * ({@code Booking.js}) with save and cancel. Built on the platform's entity explorer over the
 * {@code office.booking} group, served through {@link BookingSheet}. The confirm and cancel-booking changes are
 * defined by {@link BookingStatusChange}; mounting them as side-panel verbs is not done here (see the delivery
 * notes).
 */
public class BookingsScreenModel extends EntityExplorerTabModel {

    /** The navigation node id. */
    public static final String ID = "bookings";

    /**
     * @param parentId        the navigation node id
     * @param surfaceCatalogs the node's entity to serving-sheet catalog; {@code null} in a head-less test
     */
    public BookingsScreenModel(String parentId, ISurfaceCatalogs surfaceCatalogs) {
        super(parentId, "explorer", "Bookings", "The meeting-room bookings and their status.",
                "office.booking", null, surfaceCatalogs);
    }
}
