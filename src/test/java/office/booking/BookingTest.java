package office.booking;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cyai.validation.BeanValidationError;
import cyai.validation.IBeanContext;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class BookingTest {

    private static IBeanContext ctx(String email, Integer attendees) {
        IBeanContext ctx = Mockito.mock(IBeanContext.class);
        Mockito.when(ctx.get("organiserEmail", String.class)).thenReturn(email);
        Mockito.when(ctx.get("attendees", Integer.class)).thenReturn(attendees);
        return ctx;
    }

    @Test
    void a7_newBookingHasStatusRequested() {
        Booking booking = Booking.builder().withTitle("Sync")
                .withStartTime(LocalDateTime.of(2026, 10, 14, 10, 0))
                .withEndTime(LocalDateTime.of(2026, 10, 14, 11, 0)).build();
        assertEquals(BookingStatus.REQUESTED, booking.getStatus());
    }

    @Test
    void a7_nullStatusFallsBackToRequested() {
        assertEquals(BookingStatus.REQUESTED, Booking.builder().withStatus(null).build().getStatus());
    }

    @Test
    void malformedOrganiserEmailIsRefused() {
        List<BeanValidationError> errors = new BookingValidator().validate(ctx("not-an-email", 3));
        assertEquals(1, errors.size());
        assertEquals("organiserEmail", errors.get(0).getField());
    }

    @Test
    void attendeesZeroIsRefused() {
        List<BeanValidationError> errors = new BookingValidator().validate(ctx("a@b.com", 0));
        assertEquals(1, errors.size());
        assertEquals("attendees", errors.get(0).getField());
    }

    @Test
    void wellFormedEmailAndPositiveAttendeesAreAccepted() {
        assertTrue(new BookingValidator().validate(ctx("a@b.com", 1)).isEmpty());
    }
}
