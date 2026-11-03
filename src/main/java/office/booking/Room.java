package office.booking;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;
import cyai.entity.AbstractRdbmsEntity;
import cyai.entity.desc.EntityClassKey;

import java.util.List;
import java.util.Objects;

/**
 * A bookable meeting room: a unique name, its floor, how many people it seats and the equipment it offers.
 */
@JsonDeserialize(builder = Room.Builder.class)
public final class Room extends AbstractRdbmsEntity<Room> {

    /** The entity-descriptor name (the identity every remote surface resolves this entity by). */
    public static final String ENTITY_NAME = "office.booking.Room";

    /** The versioned entity identity; its version matches the descriptor's. */
    public static final EntityClassKey ENTITY_CLASS_KEY = new EntityClassKey(ENTITY_NAME, 1);

    private final String name;
    private final Integer floor;
    private final Integer capacity;
    private final List<Equipment> equipment;

    private Room(Builder builder) {
        super(builder.getTenantId());
        this.name = builder.name;
        this.floor = builder.floor;
        this.capacity = builder.capacity;
        this.equipment = builder.equipment;
    }

    private Room(Builder builder, long id) {
        super(id, builder.getUid(), builder.getCreatedAt(), builder.getUpdatedAt(), builder.getTenantId());
        this.name = builder.name;
        this.floor = builder.floor;
        this.capacity = builder.capacity;
        this.equipment = builder.equipment;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getName() {
        return name;
    }

    public Integer getFloor() {
        return floor;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public List<Equipment> getEquipment() {
        return equipment;
    }

    @Override
    public Room copy(long newId) {
        return builder()
                .withId(newId)
                .withUid(getUid())
                .withCreatedAt(getCreatedAt())
                .withUpdatedAt(getUpdatedAt())
                .withTenantId(getTenantId())
                .withName(name)
                .withFloor(floor)
                .withCapacity(capacity)
                .withEquipment(equipment)
                .build();
    }

    @Override
    protected String internalToString() {
        return "name=" + name + ", floor=" + floor + ", capacity=" + capacity;
    }

    @Override
    protected int internalHashCode() {
        return Objects.hash(name, floor, capacity, equipment);
    }

    @Override
    protected boolean internalEquals(Room other) {
        return Objects.equals(name, other.name)
                && Objects.equals(floor, other.floor)
                && Objects.equals(capacity, other.capacity)
                && Objects.equals(equipment, other.equipment);
    }

    @JsonPOJOBuilder(withPrefix = "with")
    public static class Builder extends AbstractRdbmsEntity.AbstractBuilder<Room, Builder> {

        private String name;
        private Integer floor;
        private Integer capacity;
        private List<Equipment> equipment;

        public Builder withName(String name) {
            this.name = name;
            return this;
        }

        public Builder withFloor(Integer floor) {
            this.floor = floor;
            return this;
        }

        public Builder withCapacity(Integer capacity) {
            this.capacity = capacity;
            return this;
        }

        public Builder withEquipment(List<Equipment> equipment) {
            this.equipment = equipment;
            return this;
        }

        @Override
        public Room build() {
            if (getId() >= 0) {
                return new Room(this, getId());
            }
            return new Room(this);
        }
    }
}
