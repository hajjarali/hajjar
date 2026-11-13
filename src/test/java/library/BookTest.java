package library;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class BookTest {

    @Test
    void a1_ratingsThreeFiveFourArePersistedAsGiven() {
        assertEquals(3, Book.builder().withTitle("A").withRating(3).build().getRating());
        assertEquals(5, Book.builder().withTitle("B").withRating(5).build().getRating());
        assertEquals(4, Book.builder().withTitle("C").withRating(4).build().getRating());
    }

    @Test
    void a2_readKeepsTrueAndDefaultsToFalse() {
        assertTrue(Book.builder().withTitle("A").withRead(true).build().getRead());
        assertFalse(Book.builder().withTitle("B").build().getRead());
    }

    @Test
    void ratingOutOfRangeIsRefused() {
        assertThrows(IllegalArgumentException.class, () -> Book.builder().withTitle("A").withRating(0).build());
        assertThrows(IllegalArgumentException.class, () -> Book.builder().withTitle("A").withRating(6).build());
    }

    @Test
    void missingTitleIsRefused() {
        assertThrows(IllegalArgumentException.class, () -> Book.builder().withRating(3).build());
    }
}
