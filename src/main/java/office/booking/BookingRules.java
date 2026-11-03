package office.booking;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collection;
import java.util.Objects;

/**
 * The Booking rules as pure functions over values, so the validator and the save path share one definition:
 * the time window (R1), capacity (R2), status transitions (R4) and the confirmed-overlap test (P1, R3).
 */
public final class BookingRules {

    /** Earliest start of a booking. */
    public static final LocalTime OPENING = LocalTime.of(8, 0);

    /** Latest end of a booking (a booking may end exactly then). */
    public static final LocalTime CLOSING = LocalTime.of(20, 0);

    private BookingRules() {
        // static rules only
    }

    /**
     * R1: end strictly after start, both on the same day, start at or after 08:00, end at or before 20:00.
     *
     * @return {@code null} when valid, otherwise the refusal message
     */
    public static String timeWindowProblem(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            return null; // required-ness is the field rules' job
        }
        if (!end.isAfter(start)) {
            return "The booking must end after it starts";
        }
        if (!start.toLocalDate().equals(end.toLocalDate())) {
            return "A booking must start and end on the same day";
        }
        if (start.toLocalTime().isBefore(OPENING) || end.toLocalTime().isAfter(CLOSING)) {
            return "A booking must lie within 08:00-20:00";
        }
        return null;
    }

    /**
     * R2: attendees at most the room's capacity.
     *
     * @return {@code null} when valid, otherwise the refusal message
     */
    public static String capacityProblem(Integer attendees, Integer capacity) {
        if (attendees == null || capacity == null) {
            return null;
        }
        if (attendees > capacity) {
            return "The room seats " + capacity + ", but " + attendees + " attendees were given";
        }
        return null;
    }

    /**
     * R4: a booking is created requested; confirmed is reachable only from requested; cancelled from requested
     * or confirmed. Staying in the same state is not a transition.
     *
     * @param from the stored status, or {@code null} for a new booking
     * @param to   the status being saved
     * @return {@code null} when allowed, otherwise the refusal message
     */
    public static String transitionProblem(BookingStatus from, BookingStatus to) {
        if (to == null || Objects.equals(from, to)) {
            return null;
        }
        if (from == null) {
            return to == BookingStatus.REQUESTED ? null : "A new booking starts as requested";
        }
        if (to == BookingStatus.CONFIRMED && from != BookingStatus.REQUESTED) {
            return "Only a requested booking can be confirmed";
        }
        if (to == BookingStatus.REQUESTED) {
            return "A booking cannot go back to requested";
        }
        return null;
    }

    /** P1: two windows overlap when {@code a.start < b.end && b.start < a.end}; touching windows do not. */
    public static boolean overlaps(LocalDateTime aStart, LocalDateTime aEnd, LocalDateTime bStart, LocalDateTime bEnd) {
        return aStart.isBefore(bEnd) && bStart.isBefore(aEnd);
    }

    /**
     * R3: whether the overlap check applies to a save: the booking becomes confirmed, or it is confirmed and its
     * room, start or end changed.
     *
     * @param before the stored booking, or {@code null} for a new one
     * @param after  the booking being saved
     */
    public static boolean overlapCheckApplies(Booking before, Booking after) {
        if (after.getStatus() != BookingStatus.CONFIRMED) {
            return false;
        }
        if (before == null || before.getStatus() != BookingStatus.CONFIRMED) {
            return true;
        }
        return !Objects.equals(before.getRoom(), after.getRoom())
                || !Objects.equals(before.getStartTime(), after.getStartTime())
                || !Objects.equals(before.getEndTime(), after.getEndTime());
    }

    /**
     * P1/R3: whether {@code candidate} overlaps any other confirmed booking of its room. Only confirmed bookings
     * count; the candidate itself (same id) is excluded, so cancelled and requested bookings never block.
     *
     * @param candidate the booking being confirmed or moved
     * @param sameRoom  the bookings of the candidate's room (any status)
     */
    public static boolean overlapsConfirmed(Booking candidate, Collection<Booking> sameRoom) {
        for (Booking other : sameRoom) {
            if (other.getStatus() != BookingStatus.CONFIRMED || sameRow(candidate, other)) {
                continue;
            }
            if (overlaps(candidate.getStartTime(), candidate.getEndTime(), other.getStartTime(), other.getEndTime())) {
                return true;
            }
        }
        return false;
    }

    private static boolean sameRow(Booking a, Booking b) {
        return a == b || (a.getId() >= 0 && a.getId() == b.getId());
    }
}
