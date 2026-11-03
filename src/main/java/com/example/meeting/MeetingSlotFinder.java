package com.example.meeting;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/** Finds the earliest slot in one day in which every attendee is free. Stateless. */
public class MeetingSlotFinder {

    private static final int STEP_MINUTES = 15;

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
        int workStart = minutes(workingHours.start());
        int workEnd = minutes(workingHours.end());

        // Clip busy times to the working hours; busy time wholly outside has no effect.
        List<int[]> busy = new ArrayList<>();
        for (List<TimeRange> attendee : attendees) {
            for (TimeRange range : attendee) {
                int start = Math.max(minutes(range.start()), workStart);
                int end = Math.min(minutes(range.end()), workEnd);
                if (start < end) {
                    busy.add(new int[] {start, end});
                }
            }
        }
        busy.sort(Comparator.<int[]>comparingInt(r -> r[0]).thenComparingInt(r -> r[1]));

        // Walk the free gaps in order. Overlapping or touching blocks merge implicitly:
        // a block starting at or before the cursor leaves no gap and only moves the cursor on.
        int cursor = workStart;
        for (int[] block : busy) {
            if (block[0] > cursor) {
                Optional<TimeRange> slot = fit(cursor, block[0], lengthMinutes);
                if (slot.isPresent()) {
                    return slot;
                }
            }
            cursor = Math.max(cursor, block[1]);
        }
        return fit(cursor, workEnd, lengthMinutes);
    }

    /** First slot in the gap [gapStart, gapEnd) starting on a 15-minute step, or empty. */
    private static Optional<TimeRange> fit(int gapStart, int gapEnd, int lengthMinutes) {
        int start = (gapStart + STEP_MINUTES - 1) / STEP_MINUTES * STEP_MINUTES;
        if ((long) start + lengthMinutes <= gapEnd) {
            return Optional.of(new TimeRange(LocalTime.ofSecondOfDay(start * 60L),
                    LocalTime.ofSecondOfDay((start + lengthMinutes) * 60L)));
        }
        return Optional.empty();
    }

    private static int minutes(LocalTime time) {
        return time.getHour() * 60 + time.getMinute();
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
