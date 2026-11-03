package office.booking;

import java.util.Collection;

/**
 * The two status changes the Bookings screen offers, "confirm" and "cancel booking". Each runs the same rules as
 * a save ({@link BookingRules}) and either returns the changed Booking or refuses with a message the screen shows.
 */
public final class BookingStatusChange {

    /** A refused status change; the message is what the user reads. */
    public static final class Refused extends Exception {
        private static final long serialVersionUID = 1L;

        Refused(String message) {
            super(message);
        }
    }

    private BookingStatusChange() {
        // static helpers only
    }

    /**
     * Confirms a booking: allowed only from requested, and only when it overlaps no other confirmed booking of
     * its room.
     *
     * @param booking  the stored booking
     * @param sameRoom the bookings of the same room (any status)
     * @return the confirmed copy; the stored booking is not modified
     * @throws Refused when the transition or the overlap rule forbids it
     */
    public static Booking confirm(Booking booking, Collection<Booking> sameRoom) throws Refused {
        String problem = BookingRules.transitionProblem(booking.getStatus(), BookingStatus.CONFIRMED);
        if (problem != null) {
            throw new Refused(problem);
        }
        Booking confirmed = withStatus(booking, BookingStatus.CONFIRMED);
        if (BookingRules.overlapCheckApplies(booking, confirmed)
                && BookingRules.overlapsConfirmed(confirmed, sameRoom)) {
            throw new Refused("The room is already booked at that time");
        }
        return confirmed;
    }

    /**
     * Cancels a booking, releasing its slot. Allowed from requested or confirmed.
     *
     * @return the cancelled copy; the stored booking is not modified
     * @throws Refused when the booking cannot be cancelled
     */
    public static Booking cancel(Booking booking) throws Refused {
        String problem = BookingRules.transitionProblem(booking.getStatus(), BookingStatus.CANCELLED);
        if (problem != null) {
            throw new Refused(problem);
        }
        return withStatus(booking, BookingStatus.CANCELLED);
    }

    private static Booking withStatus(Booking b, BookingStatus status) {
        return Booking.builder().withId(b.getId()).withUid(b.getUid()).withCreatedAt(b.getCreatedAt())
                .withUpdatedAt(b.getUpdatedAt()).withTenantId(b.getTenantId())
                .withRoom(b.getRoom()).withTitle(b.getTitle()).withOrganiserEmail(b.getOrganiserEmail())
                .withStartTime(b.getStartTime()).withEndTime(b.getEndTime()).withAttendees(b.getAttendees())
                .withStatus(status).build();
    }
}
