package office.booking;

import cyai.entity.model.explorer.EntityExplorerTabModel;
import cyai.observer.client.surface.ISurfaceCatalogs;

/**
 * The Rooms screen: a list of Rooms (name, floor, capacity, equipment) with open, delete and new, and the
 * selected Room's default form ({@code Room.js}) with save and cancel. Built on the platform's entity explorer
 * over the {@code office.booking} group, which serves the table, the side-panel form and the actions through
 * {@link RoomSheet}.
 */
public class RoomsScreenModel extends EntityExplorerTabModel {

    /** The navigation node id. */
    public static final String ID = "rooms";

    /**
     * @param parentId        the navigation node id
     * @param surfaceCatalogs the node's entity to serving-sheet catalog; {@code null} in a head-less test
     */
    public RoomsScreenModel(String parentId, ISurfaceCatalogs surfaceCatalogs) {
        super(parentId, "explorer", "Rooms", "The meeting rooms people can book.",
                "office.booking", null, surfaceCatalogs);
    }
}
