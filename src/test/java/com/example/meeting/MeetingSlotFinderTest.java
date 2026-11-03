package com.example.meeting;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalTime;
import org.junit.jupiter.api.Test;

/** Acceptance examples A1–A15 for the algorithm are added with the algorithm task. */
class MeetingSlotFinderTest {

    @Test
    void timeRangeKeepsStartAndEnd() {
        TimeRange range = new TimeRange(LocalTime.of(9, 0), LocalTime.of(10, 0));
        assertEquals(LocalTime.of(9, 0), range.start());
        assertEquals(LocalTime.of(10, 0), range.end());
    }
}
