package office.booking;

import com.google.inject.Inject;
import cyai.entity.desc.view.Icon;
import cyai.observer.client.surface.ISurfaceCatalogs;
import cyai.uiai.model.ApplicationModel;
import cyai.uiai.model.IApplicationModule;

import java.util.List;

/**
 * Registers the meeting-room screens under the {@code Meeting rooms} navigation group.
 */
public final class BookingApplicationModule implements IApplicationModule {

    /** The module name. */
    public static final String NAME = "booking";

    /** The navigation group id. */
    public static final String GROUP = "meeting-rooms";

    @Inject
    private ISurfaceCatalogs surfaceCatalogs;

    /** Service-loader constructor. */
    public BookingApplicationModule() {
        // injected by the platform
    }

    /** Test seam: the collaborator is passed in ({@code null} head-less). */
    BookingApplicationModule(ISurfaceCatalogs surfaceCatalogs) {
        this.surfaceCatalogs = surfaceCatalogs;
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public void configure(ApplicationModel model) {
        // ensure, never add: another module may file under the same group
        model.ensureNavigationGroup(List.of(), GROUP, "Meeting rooms", Icon.DASHBOARD);
        model.addNavigationNode(List.of(GROUP), RoomsScreenModel.ID, "Rooms", Icon.DASHBOARD, true,
                () -> new RoomsScreenModel(RoomsScreenModel.ID, surfaceCatalogs));
    }

    @Override
    public void close() {
        // nothing opened
    }
}
