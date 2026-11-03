package com.example.meeting;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;

class MeetingSlotFinderTest {

    private final MeetingSlotFinder finder = new MeetingSlotFinder();
    private final TimeRange hours = r(9, 0, 17, 0);

    private static TimeRange r(int h1, int m1, int h2, int m2) {
        return new TimeRange(LocalTime.of(h1, m1), LocalTime.of(h2, m2));
    }

    @SafeVarargs
    private static List<List<TimeRange>> people(List<TimeRange>... p) {
        return List.of(p);
    }

    private static List<TimeRange> busy(TimeRange... t) {
        return List.of(t);
    }

    private void assertSlot(Optional<TimeRange> actual, TimeRange expected) {
        assertEquals(Optional.of(expected), actual);
    }

    @Test
    void a1_overlappingBusyTimesMerge() {
        assertSlot(finder.find(people(busy(r(9, 0, 10, 0)), busy(r(9, 30, 11, 0))), hours, 30), r(11, 0, 11, 30));
    }

    @Test
    void a2_touchingBusyTimesMerge() {
        assertSlot(finder.find(people(busy(r(9, 0, 10, 0), r(10, 0, 10, 30)), busy()), hours, 30), r(10, 30, 11, 0));
    }

    @Test
    void a3_gapExactlyAsLongAsMeetingFits() {
        assertSlot(finder.find(people(busy(r(9, 0, 10, 0)), busy(r(10, 30, 17, 0))), hours, 30), r(10, 0, 10, 30));
    }

    @Test
    void a4_tooShortGapGivesNoSlot() {
        assertTrue(finder.find(people(busy(r(9, 0, 10, 0)), busy(r(10, 15, 17, 0))), hours, 30).isEmpty());
    }

    @Test
    void a5_slotCrossingEndOfWorkingHoursGivesNoSlot() {
        assertTrue(finder.find(people(busy(r(9, 0, 16, 45))), hours, 30).isEmpty());
    }

    @Test
    void a6_slotEndingAtEndOfWorkingHoursIsAllowed() {
        assertSlot(finder.find(people(busy(r(9, 0, 16, 30))), hours, 30), r(16, 30, 17, 0));
    }

    @Test
    void a7_busyTimeOutsideWorkingHoursHasNoEffect() {
        assertSlot(finder.find(people(busy(r(8, 0, 9, 30), r(17, 0, 18, 0))), hours, 30), r(9, 30, 10, 0));
        assertSlot(finder.find(people(busy(r(7, 0, 8, 0))), hours, 30), r(9, 0, 9, 30));
    }

    @Test
    void a8_nobodyBusyGivesWorkingHoursStart() {
        assertSlot(finder.find(people(busy(), busy()), hours, 60), r(9, 0, 10, 0));
    }

    @Test
    void a9_attendeeWithoutBusyTimesIsFree() {
        assertSlot(finder.find(people(busy(), busy(r(9, 0, 12, 0))), hours, 45), r(12, 0, 12, 45));
    }

    @Test
    void a10_wholeDayMeeting() {
        assertTrue(finder.find(people(busy(r(12, 0, 12, 15))), hours, 480).isEmpty());
        assertSlot(finder.find(people(busy()), hours, 480), r(9, 0, 17, 0));
    }

    @Test
    void a11_adjacentBusyTimesOfDifferentAttendeesMerge() {
        assertSlot(finder.find(people(busy(r(9, 0, 9, 15)), busy(r(9, 15, 9, 30))), hours, 30), r(9, 30, 10, 0));
    }

    @Test
    void a12_orderDoesNotMatterAndCallIsRepeatable() {
        var forward = people(busy(r(9, 0, 10, 0)), busy(r(9, 30, 11, 0)));
        var reversed = people(busy(r(9, 30, 11, 0)), busy(r(9, 0, 10, 0)));
        var reversedInner = people(busy(r(10, 0, 10, 30), r(9, 0, 10, 0)), busy(r(9, 30, 11, 0)));
        assertSlot(finder.find(forward, hours, 30), r(11, 0, 11, 30));
        assertSlot(finder.find(forward, hours, 30), r(11, 0, 11, 30));
        assertSlot(finder.find(reversed, hours, 30), r(11, 0, 11, 30));
        assertSlot(finder.find(reversedInner, hours, 30), r(11, 0, 11, 30));
    }

    @Test
    void a14_offStepLengthUsesExactMinutes() {
        assertSlot(finder.find(people(busy()), hours, 20), r(9, 0, 9, 20));
    }

    @Test
    void a15_offStepBusyTimeRoundsStartUp() {
        assertSlot(finder.find(people(busy(r(9, 10, 9, 40))), hours, 30), r(9, 45, 10, 15));
        assertSlot(finder.find(people(busy(r(9, 0, 9, 10))), hours, 30), r(9, 15, 9, 45));
    }
}
