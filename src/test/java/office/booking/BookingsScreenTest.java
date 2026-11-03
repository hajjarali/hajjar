package office.booking;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import cyai.observer.api.sheet.entity.AccessMode;
import cyai.observer.api.sheet.entity.ServesEntity;
import cyai.uiai.model.ApplicationModel;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;

class BookingsScreenTest {

    private static Booking booking(long id, BookingStatus status, int sh, int sm, int eh, int em) {
        return Booking.builder().withId(id).withStatus(status)
                .withStartTime(LocalDateTime.of(2026, 10, 14, sh, sm))
                .withEndTime(LocalDateTime.of(2026, 10, 14, eh, em)).build();
    }

    @Test
    void navigationEntryIsRegisteredAtMeetingRoomsBookings() {
        ApplicationModel model = new ApplicationModel();
        new BookingApplicationModule(null).configure(model);

        assertNotNull(model.findNavigationNode(List.of("meeting-rooms", "bookings")), "Meeting rooms > Bookings");
        assertNotNull(model.findNavigationNode(List.of("meeting-rooms", "rooms")), "Rooms entry is kept");
    }

    @Test
    void bookingsAreServedByTheWritableBookingSheet() {
        ServesEntity serves = BookingSheet.class.getAnnotation(ServesEntity.class);
        assertNotNull(serves);
        assertEquals(Booking.class, serves.entity());
        assertEquals(AccessMode.READ_WRITE, serves.mode());
    }

    @Test
    void a7_confirmOnRequestedBookingConfirmsIt() throws Exception {
        Booking requested = booking(1, BookingStatus.REQUESTED, 10, 0, 11, 0);
        assertEquals(BookingStatus.CONFIRMED, BookingStatusChange.confirm(requested, List.of()).getStatus());
    }

    @Test
    void a7_confirmOnCancelledBookingIsRefused() {
        Booking cancelled = booking(1, BookingStatus.CANCELLED, 10, 0, 11, 0);
        assertThrows(BookingStatusChange.Refused.class, () -> BookingStatusChange.confirm(cancelled, List.of()));
    }

    @Test
    void confirmOverlappingAConfirmedBookingIsRefusedWithAMessage() {
        Booking other = booking(1, BookingStatus.CONFIRMED, 10, 0, 11, 0);
        Booking requested = booking(2, BookingStatus.REQUESTED, 10, 30, 11, 30);
        BookingStatusChange.Refused refused = assertThrows(BookingStatusChange.Refused.class,
                () -> BookingStatusChange.confirm(requested, List.of(other, requested)));
        assertEquals("The room is already booked at that time", refused.getMessage());
    }

    @Test
    void a4_cancelBookingOnConfirmedCancelsItAndFreesTheSlot() throws Exception {
        Booking confirmed = booking(1, BookingStatus.CONFIRMED, 10, 0, 11, 0);
        Booking cancelled = BookingStatusChange.cancel(confirmed);
        assertEquals(BookingStatus.CANCELLED, cancelled.getStatus());

        Booking next = booking(2, BookingStatus.REQUESTED, 10, 30, 11, 30);
        assertEquals(BookingStatus.CONFIRMED,
                BookingStatusChange.confirm(next, List.of(cancelled, next)).getStatus());
    }
}
