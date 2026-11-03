package com.example.meeting;

import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class MeetingSlotFinderValidationTest {

    private final MeetingSlotFinder finder = new MeetingSlotFinder();
    private final TimeRange hours = new TimeRange(LocalTime.of(9, 0), LocalTime.of(17, 0));
    private final List<List<TimeRange>> free = List.of(List.of());

    @ParameterizedTest
    @ValueSource(ints = {0, -15})
    void a13_nonPositiveLengthIsRejected(int length) {
        assertThrows(IllegalArgumentException.class, () -> finder.find(free, hours, length));
    }

    @Test
    void a13_busyTimeWithEndNotAfterStartIsRejected() {
        assertThrows(IllegalArgumentException.class,
                () -> new TimeRange(LocalTime.of(10, 0), LocalTime.of(10, 0)));
        assertThrows(IllegalArgumentException.class,
                () -> new TimeRange(LocalTime.of(10, 30), LocalTime.of(10, 0)));
    }

    @Test
    void a13_workingHoursWithEndBeforeStartIsRejected() {
        assertThrows(IllegalArgumentException.class,
                () -> new TimeRange(LocalTime.of(17, 0), LocalTime.of(9, 0)));
    }

    @Test
    void a13_emptyAttendeeListIsRejected() {
        assertThrows(IllegalArgumentException.class, () -> finder.find(List.of(), hours, 30));
    }

    @Test
    void a13_nullInputsAreRejected() {
        assertThrows(NullPointerException.class, () -> finder.find(null, hours, 30));
        assertThrows(NullPointerException.class, () -> finder.find(free, null, 30));
        List<List<TimeRange>> withNullBusyList = new ArrayList<>();
        withNullBusyList.add(null);
        assertThrows(NullPointerException.class, () -> finder.find(withNullBusyList, hours, 30));
    }
}
