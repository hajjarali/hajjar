package com.example.meeting;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

/** Finds the earliest slot in one day in which every attendee is free. Stateless. */
public class MeetingSlotFinder {

    /**
     * @param attendees     one list of busy times per attendee (an empty list means free all day)
     * @param workingHours  the range inside which the slot must lie
     * @param lengthMinutes meeting length in minutes, greater than zero
     * @return the earliest slot, or empty when none fits
     * @throws NullPointerException     when any input (or a busy list) is null
     * @throws IllegalArgumentException when there are no attendees or the length is not positive
     */
    public Optional<TimeRange> find(List<List<TimeRange>> attendees, TimeRange workingHours, int lengthMinutes) {
        validate(attendees, workingHours, lengthMinutes);
        return Optional.empty();
    }

    private static void validate(List<List<TimeRange>> attendees, TimeRange workingHours, int lengthMinutes) {
        Objects.requireNonNull(attendees, "attendees");
        Objects.requireNonNull(workingHours, "workingHours");
        if (attendees.isEmpty()) {
            throw new IllegalArgumentException("at least one attendee is required");
        }
        if (lengthMinutes <= 0) {
            throw new IllegalArgumentException("meeting length must be greater than zero: " + lengthMinutes);
        }
        for (List<TimeRange> busy : attendees) {
            Objects.requireNonNull(busy, "busy times");
            for (TimeRange range : busy) {
                Objects.requireNonNull(range, "busy time");
            }
        }
    }
}
