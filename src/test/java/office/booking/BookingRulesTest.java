package office.booking;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;

class BookingRulesTest {

    private static LocalDateTime at(int h, int m) {
        return LocalDateTime.of(2026, 10, 14, h, m);
    }

    private static Booking booking(long id, BookingStatus status, int sh, int sm, int eh, int em) {
        return Booking.builder().withId(id).withStatus(status).withStartTime(at(sh, sm)).withEndTime(at(eh, em)).build();
    }

    private static boolean refusedConfirm(Booking candidate, Booking... others) {
        return BookingRules.overlapCheckApplies(null, candidate)
                && BookingRules.overlapsConfirmed(candidate, List.of(others));
    }

    @Test
    void a1_overlappingConfirmationIsRefused() {
        Booking atlas = booking(1, BookingStatus.CONFIRMED, 10, 0, 11, 0);
        assertTrue(refusedConfirm(booking(2, BookingStatus.CONFIRMED, 10, 30, 11, 30), atlas));
    }

    @Test
    void a2_touchingConfirmationIsAccepted() {
        Booking atlas = booking(1, BookingStatus.CONFIRMED, 10, 0, 11, 0);
        assertFalse(refusedConfirm(booking(2, BookingStatus.CONFIRMED, 11, 0, 12, 0), atlas));
    }

    @Test
    void a3_requestedSavesBesideConfirmedAndOtherRoomIsAccepted() {
        Booking requested = booking(2, BookingStatus.REQUESTED, 10, 30, 11, 30);
        assertFalse(BookingRules.overlapCheckApplies(null, requested));
        // another room: its confirmed bookings are the only ones handed in, none overlaps
        assertFalse(refusedConfirm(booking(3, BookingStatus.CONFIRMED, 10, 30, 11, 30)));
    }

    @Test
    void a4_cancelledBookingFreesItsSlot() {
        Booking cancelled = booking(1, BookingStatus.CANCELLED, 10, 0, 11, 0);
        assertFalse(refusedConfirm(booking(2, BookingStatus.CONFIRMED, 10, 30, 11, 30), cancelled));
    }

    @Test
    void a5_timeWindow() {
        assertNotNull(BookingRules.timeWindowProblem(at(7, 30), at(9, 0)));
        assertNotNull(BookingRules.timeWindowProblem(at(19, 0), at(20, 30)));
        assertNotNull(BookingRules.timeWindowProblem(at(10, 0), at(10, 0)));
        assertNotNull(BookingRules.timeWindowProblem(at(11, 0), at(10, 0)));
        assertNotNull(BookingRules.timeWindowProblem(at(19, 0), at(9, 0).plusDays(1)));
        assertNull(BookingRules.timeWindowProblem(at(8, 0), at(9, 0)));
        assertNull(BookingRules.timeWindowProblem(at(19, 0), at(20, 0)));
    }

    @Test
    void a6_capacity() {
        assertNull(BookingRules.capacityProblem(12, 12));
        assertNotNull(BookingRules.capacityProblem(13, 12));
    }

    @Test
    void a7_transitions() {
        assertEquals(BookingStatus.REQUESTED, Booking.builder().build().getStatus());
        assertNull(BookingRules.transitionProblem(BookingStatus.REQUESTED, BookingStatus.CONFIRMED));
        assertNotNull(BookingRules.transitionProblem(BookingStatus.CANCELLED, BookingStatus.CONFIRMED));
        assertNull(BookingRules.transitionProblem(BookingStatus.CONFIRMED, BookingStatus.CANCELLED));
    }

    @Test
    void a8_movingConfirmedIntoAnotherConfirmedIsRefused() {
        Booking first = booking(1, BookingStatus.CONFIRMED, 10, 0, 11, 0);
        Booking storedSecond = booking(2, BookingStatus.CONFIRMED, 12, 0, 13, 0);
        Booking moved = booking(2, BookingStatus.CONFIRMED, 10, 30, 11, 30);
        assertTrue(BookingRules.overlapCheckApplies(storedSecond, moved));
        assertTrue(BookingRules.overlapsConfirmed(moved, List.of(first, storedSecond)));
        // refusal leaves the stored row as it was
        assertEquals(at(12, 0), storedSecond.getStartTime());
        assertEquals(at(13, 0), storedSecond.getEndTime());
    }

    @Test
    void confirmedBookingSavedUnchangedSkipsTheOverlapCheck() {
        Booking stored = booking(1, BookingStatus.CONFIRMED, 10, 0, 11, 0);
        assertFalse(BookingRules.overlapCheckApplies(stored, booking(1, BookingStatus.CONFIRMED, 10, 0, 11, 0)));
    }
}
