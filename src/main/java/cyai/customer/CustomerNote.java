package cyai.customer;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;
import cyai.entity.AbstractRdbmsEntity;
import java.time.LocalDate;
import java.util.Objects;

/** A free-text note recorded against a customer name. */
@JsonDeserialize(builder = CustomerNote.Builder.class)
public final class CustomerNote extends AbstractRdbmsEntity<CustomerNote> {

    private final String customerName;
    private final String noteText;
    private final LocalDate createdDate;

    private CustomerNote(Builder builder) {
        super(builder);
        this.customerName = builder.customerName;
        this.noteText = builder.noteText;
        this.createdDate = builder.createdDate;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getNoteText() {
        return noteText;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    @Override
    public CustomerNote copy(long newId) {
        return builder().withId(newId).withUid(getUid()).withCreatedAt(getCreatedAt())
                .withUpdatedAt(getUpdatedAt()).withTenantId(getTenantId())
                .withCustomerName(customerName).withNoteText(noteText).withCreatedDate(createdDate).build();
    }

    @Override
    protected String internalToString() {
        return "customerName=" + customerName + ", createdDate=" + createdDate;
    }

    @Override
    protected int internalHashCode() {
        return Objects.hash(customerName, noteText, createdDate);
    }

    @Override
    protected boolean internalEquals(CustomerNote o) {
        return Objects.equals(customerName, o.customerName)
                && Objects.equals(noteText, o.noteText)
                && Objects.equals(createdDate, o.createdDate);
    }

    @JsonPOJOBuilder(withPrefix = "with")
    public static final class Builder extends AbstractRdbmsEntity.AbstractBuilder<CustomerNote, Builder> {
        private String customerName;
        private String noteText;
        private LocalDate createdDate;

        public Builder withCustomerName(String customerName) {
            this.customerName = customerName;
            return this;
        }

        public Builder withNoteText(String noteText) {
            this.noteText = noteText;
            return this;
        }

        public Builder withCreatedDate(LocalDate createdDate) {
            this.createdDate = createdDate;
            return this;
        }

        @Override
        public CustomerNote build() {
            return new CustomerNote(this);
        }
    }
}
