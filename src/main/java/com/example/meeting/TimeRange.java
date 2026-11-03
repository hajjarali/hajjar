package com.example.meeting;

import java.time.LocalTime;
import java.util.Objects;

/** An immutable time range within one day; {@code end} is always after {@code start}. */
public record TimeRange(LocalTime start, LocalTime end) {

    public TimeRange {
        Objects.requireNonNull(start, "start");
        Objects.requireNonNull(end, "end");
        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("end must be after start: " + start + "–" + end);
        }
    }
}
