package office.booking;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import cyai.observer.api.sheet.entity.AccessMode;
import cyai.observer.api.sheet.entity.ServesEntity;
import cyai.uiai.model.ApplicationModel;
import java.util.List;
import org.junit.jupiter.api.Test;

class RoomsScreenTest {

    @Test
    void navigationEntryIsRegisteredAtMeetingRoomsRooms() {
        ApplicationModel model = new ApplicationModel();
        new BookingApplicationModule(null).configure(model);

        assertNotNull(model.findNavigationNode(List.of("meeting-rooms", "rooms")), "Meeting rooms > Rooms");
    }

    @Test
    void a6_roomsAreListedAndEditedThroughTheWritableRoomSheet() {
        ServesEntity serves = RoomSheet.class.getAnnotation(ServesEntity.class);
        assertNotNull(serves);
        assertEquals(Room.class, serves.entity());
        assertEquals(AccessMode.READ_WRITE, serves.mode());
    }
}
