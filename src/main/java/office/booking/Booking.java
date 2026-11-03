package office.booking;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;
import cyai.entity.AbstractRdbmsEntity;
import cyai.entity.Ref;
import cyai.entity.desc.EntityClassKey;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * A reservation of one {@link Room} for a time window on one day. A new booking is {@link BookingStatus#REQUESTED}.
 */
@JsonDeserialize(builder = Booking.Builder.class)
public final class Booking extends AbstractRdbmsEntity<Booking> {

    /** The entity-descriptor name (the identity every remote surface resolves this entity by). */
    public static final String ENTITY_NAME = "office.booking.Booking";

    /** The versioned entity identity; its version matches the descriptor's. */
    public static final EntityClassKey ENTITY_CLASS_KEY = new EntityClassKey(ENTITY_NAME, 1);

    private final Ref<Room> room;
    private final String title;
    private final String organiserEmail;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    private final Integer attendees;
    private final BookingStatus status;

    private Booking(Builder builder) {
        super(builder.getTenantId());
        this.room = builder.room;
        this.title = builder.title;
        this.organiserEmail = builder.organiserEmail;
        this.startTime = builder.startTime;
        this.endTime = builder.endTime;
        this.attendees = builder.attendees;
        this.status = builder.status;
    }

    private Booking(Builder builder, long id) {
        super(id, builder.getUid(), builder.getCreatedAt(), builder.getUpdatedAt(), builder.getTenantId());
        this.room = builder.room;
        this.title = builder.title;
        this.organiserEmail = builder.organiserEmail;
        this.startTime = builder.startTime;
        this.endTime = builder.endTime;
        this.attendees = builder.attendees;
        this.status = builder.status;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Ref<Room> getRoom() {
        return room;
    }

    public String getTitle() {
        return title;
    }

    public String getOrganiserEmail() {
        return organiserEmail;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public Integer getAttendees() {
        return attendees;
    }

    public BookingStatus getStatus() {
        return status;
    }

    @Override
    public Booking copy(long newId) {
        return builder()
                .withId(newId)
                .withUid(getUid())
                .withCreatedAt(getCreatedAt())
                .withUpdatedAt(getUpdatedAt())
                .withTenantId(getTenantId())
                .withRoom(room)
                .withTitle(title)
                .withOrganiserEmail(organiserEmail)
                .withStartTime(startTime)
                .withEndTime(endTime)
                .withAttendees(attendees)
                .withStatus(status)
                .build();
    }

    @Override
    protected String internalToString() {
        return "title=" + title + ", start=" + startTime + ", end=" + endTime + ", status=" + status;
    }

    @Override
    protected int internalHashCode() {
        return Objects.hash(room, title, organiserEmail, startTime, endTime, attendees, status);
    }

    @Override
    protected boolean internalEquals(Booking other) {
        return Objects.equals(room, other.room)
                && Objects.equals(title, other.title)
                && Objects.equals(organiserEmail, other.organiserEmail)
                && Objects.equals(startTime, other.startTime)
                && Objects.equals(endTime, other.endTime)
                && Objects.equals(attendees, other.attendees)
                && Objects.equals(status, other.status);
    }

    @JsonPOJOBuilder(withPrefix = "with")
    public static class Builder extends AbstractRdbmsEntity.AbstractBuilder<Booking, Builder> {

        private Ref<Room> room;
        private String title;
        private String organiserEmail;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Integer attendees;
        private BookingStatus status = BookingStatus.REQUESTED;

        public Builder withRoom(Ref<Room> room) {
            this.room = room;
            return this;
        }

        public Builder withTitle(String title) {
            this.title = title;
            return this;
        }

        public Builder withOrganiserEmail(String organiserEmail) {
            this.organiserEmail = organiserEmail;
            return this;
        }

        public Builder withStartTime(LocalDateTime startTime) {
            this.startTime = startTime;
            return this;
        }

        public Builder withEndTime(LocalDateTime endTime) {
            this.endTime = endTime;
            return this;
        }

        public Builder withAttendees(Integer attendees) {
            this.attendees = attendees;
            return this;
        }

        /** A null status falls back to the default, requested. */
        public Builder withStatus(BookingStatus status) {
            this.status = status == null ? BookingStatus.REQUESTED : status;
            return this;
        }

        @Override
        public Booking build() {
            if (getId() >= 0) {
                return new Booking(this, getId());
            }
            return new Booking(this);
        }
    }
}
