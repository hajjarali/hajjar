package procurement;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;
import cyai.entity.AbstractRdbmsEntity;
import java.util.Objects;

/** A company that supplies goods or services, kept in a simple register. */
@JsonDeserialize(builder = Supplier.Builder.class)
public final class Supplier extends AbstractRdbmsEntity<Supplier> {

    private final String name;
    private final String contactEmail;
    private final String country;
    private final Boolean active;

    private Supplier(Builder builder) {
        super(builder);
        this.name = builder.name;
        this.contactEmail = builder.contactEmail;
        this.country = builder.country;
        this.active = builder.active;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getName() {
        return name;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public String getCountry() {
        return country;
    }

    public Boolean getActive() {
        return active;
    }

    @Override
    public Supplier copy(long newId) {
        return builder().withId(newId).withUid(getUid()).withCreatedAt(getCreatedAt())
                .withUpdatedAt(getUpdatedAt()).withTenantId(getTenantId())
                .withName(name).withContactEmail(contactEmail).withCountry(country).withActive(active).build();
    }

    @Override
    protected String internalToString() {
        return "name=" + name + ", contactEmail=" + contactEmail + ", country=" + country + ", active=" + active;
    }

    @Override
    protected int internalHashCode() {
        return Objects.hash(name, contactEmail, country, active);
    }

    @Override
    protected boolean internalEquals(Supplier o) {
        return Objects.equals(name, o.name)
                && Objects.equals(contactEmail, o.contactEmail)
                && Objects.equals(country, o.country)
                && Objects.equals(active, o.active);
    }

    @JsonPOJOBuilder(withPrefix = "with")
    public static final class Builder extends AbstractRdbmsEntity.AbstractBuilder<Supplier, Builder> {
        private String name;
        private String contactEmail;
        private String country;
        private Boolean active;

        public Builder withName(String name) {
            this.name = name;
            return this;
        }

        public Builder withContactEmail(String contactEmail) {
            this.contactEmail = contactEmail;
            return this;
        }

        public Builder withCountry(String country) {
            this.country = country;
            return this;
        }

        public Builder withActive(Boolean active) {
            this.active = active;
            return this;
        }

        @Override
        public Supplier build() {
            return new Supplier(this);
        }
    }
}
