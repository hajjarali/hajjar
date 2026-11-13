package library;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import cyai.observer.api.sheet.annotations.Sheet;
import cyai.observer.api.sheet.entity.AccessMode;
import cyai.observer.api.sheet.entity.ServesEntity;
import java.util.List;
import org.junit.jupiter.api.Test;

class BookSheetTest {

    private static Book book(String title, Integer rating) {
        return Book.builder().withTitle(title).withRating(rating).build();
    }

    @Test
    void a1_booksRatedThreeFiveFourAreListedFiveFourThree() {
        List<Book> sorted = BookSheet.sortByRatingDescending(
                List.of(book("three", 3), book("five", 5), book("four", 4)));

        assertEquals(List.of(5, 4, 3), sorted.stream().map(Book::getRating).toList());
    }

    @Test
    void unratedBooksComeLast() {
        List<Book> sorted = BookSheet.sortByRatingDescending(
                List.of(book("none", null), book("two", 2), book("five", 5)));

        assertEquals(List.of("five", "two", "none"), sorted.stream().map(Book::getTitle).toList());
    }

    @Test
    void sheetServesBookForReadAndWrite() {
        ServesEntity serves = BookSheet.class.getAnnotation(ServesEntity.class);
        assertNotNull(serves);
        assertEquals(Book.class, serves.entity());
        assertEquals(AccessMode.READ_WRITE, serves.mode());
        assertEquals(LibraryCallerSheet.NAME, BookSheet.class.getAnnotation(Sheet.class).callerSheet());
    }
}
