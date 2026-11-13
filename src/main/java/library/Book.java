package library;

import cyai.entity.AbstractRdbmsEntity;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;
import java.util.Objects;

/** A book in the small library: title, author, rating (1 to 5) and read flag. */
@JsonDeserialize(builder = Book.Builder.class)
public final class Book extends AbstractRdbmsEntity<Book> {

    /** Lowest accepted rating. */
    public static final int MIN_RATING = 1;
    /** Highest accepted rating. */
    public static final int MAX_RATING = 5;

    private final String title;
    private final String author;
    private final Integer rating;
    private final Boolean read;

    private Book(Builder builder) {
        super(builder);
        if (builder.title == null || builder.title.isBlank()) {
            throw new IllegalArgumentException("A book needs a title");
        }
        if (builder.rating != null && (builder.rating < MIN_RATING || builder.rating > MAX_RATING)) {
            throw new IllegalArgumentException(
                    "Rating must be between " + MIN_RATING + " and " + MAX_RATING + " but was " + builder.rating);
        }
        this.title = builder.title;
        this.author = builder.author;
        this.rating = builder.rating;
        this.read = builder.read == null ? Boolean.FALSE : builder.read;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public Integer getRating() {
        return rating;
    }

    public Boolean getRead() {
        return read;
    }

    @Override
    public Book copy(long newId) {
        return builder().withId(newId).withUid(getUid()).withCreatedAt(getCreatedAt())
                .withUpdatedAt(getUpdatedAt()).withTenantId(getTenantId())
                .withTitle(title).withAuthor(author).withRating(rating).withRead(read).build();
    }

    @Override
    protected String internalToString() {
        return "title=" + title + ", author=" + author + ", rating=" + rating + ", read=" + read;
    }

    @Override
    protected int internalHashCode() {
        return Objects.hash(title, author, rating, read);
    }

    @Override
    protected boolean internalEquals(Book o) {
        return Objects.equals(title, o.title) && Objects.equals(author, o.author)
                && Objects.equals(rating, o.rating) && Objects.equals(read, o.read);
    }

    /** Builder of {@link Book}. */
    @JsonPOJOBuilder(withPrefix = "with")
    public static final class Builder extends AbstractRdbmsEntity.AbstractBuilder<Book, Builder> {
        private String title;
        private String author;
        private Integer rating;
        private Boolean read;

        public Builder withTitle(String title) {
            this.title = title;
            return this;
        }

        public Builder withAuthor(String author) {
            this.author = author;
            return this;
        }

        public Builder withRating(Integer rating) {
            this.rating = rating;
            return this;
        }

        public Builder withRead(Boolean read) {
            this.read = read;
            return this;
        }

        @Override
        public Book build() {
            return new Book(this);
        }
    }
}
