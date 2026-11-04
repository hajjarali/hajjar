package cyai.sales.lead;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;
import cyai.entity.AbstractRdbmsEntity;
import cyai.entity.desc.EntityClassKey;
import java.util.Objects;

/**
 * A visitor's request for a test drive or a quote. Creation order is the inherited
 * {@code createdAt} system field, which the newest-first listing sorts on; no field is added for it.
 */
@JsonDeserialize(builder = LeadRequest.Builder.class)
public final class LeadRequest extends AbstractRdbmsEntity<LeadRequest> {

    /** The entity-descriptor name. */
    public static final String ENTITY_NAME = "sales.lead.LeadRequest";

    /** The versioned entity identity. */
    public static final EntityClassKey ENTITY_CLASS_KEY = new EntityClassKey(ENTITY_NAME, 1);

    private final String fullName;
    private final String email;
    private final String phone;
    private final RequestType requestType;
    private final String preferredModel;
    private final String message;
    private final LeadRequestStatus status;

    private LeadRequest(Builder builder) {
        super(builder.getTenantId());
        this.fullName = builder.fullName;
        this.email = builder.email;
        this.phone = builder.phone;
        this.requestType = builder.requestType;
        this.preferredModel = builder.preferredModel;
        this.message = builder.message;
        this.status = builder.status == null ? LeadRequestStatus.NEW : builder.status;
    }

    private LeadRequest(Builder builder, long id) {
        super(id, builder.getUid(), builder.getCreatedAt(), builder.getUpdatedAt(), builder.getTenantId());
        this.fullName = builder.fullName;
        this.email = builder.email;
        this.phone = builder.phone;
        this.requestType = builder.requestType;
        this.preferredModel = builder.preferredModel;
        this.message = builder.message;
        this.status = builder.status == null ? LeadRequestStatus.NEW : builder.status;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public RequestType getRequestType() {
        return requestType;
    }

    public String getPreferredModel() {
        return preferredModel;
    }

    public String getMessage() {
        return message;
    }

    public LeadRequestStatus getStatus() {
        return status;
    }

    @Override
    public LeadRequest copy(long newId) {
        return builder()
                .withId(newId)
                .withUid(getUid())
                .withCreatedAt(getCreatedAt())
                .withUpdatedAt(getUpdatedAt())
                .withTenantId(getTenantId())
                .withFullName(fullName)
                .withEmail(email)
                .withPhone(phone)
                .withRequestType(requestType)
                .withPreferredModel(preferredModel)
                .withMessage(message)
                .withStatus(status)
                .build();
    }

    @Override
    protected String internalToString() {
        return "fullName=" + fullName + ", email=" + email + ", requestType=" + requestType + ", status=" + status;
    }

    @Override
    protected int internalHashCode() {
        return Objects.hash(fullName, email, phone, requestType, preferredModel, message, status);
    }

    @Override
    protected boolean internalEquals(LeadRequest other) {
        return Objects.equals(fullName, other.fullName)
                && Objects.equals(email, other.email)
                && Objects.equals(phone, other.phone)
                && requestType == other.requestType
                && Objects.equals(preferredModel, other.preferredModel)
                && Objects.equals(message, other.message)
                && status == other.status;
    }

    @JsonPOJOBuilder(withPrefix = "with")
    public static class Builder extends AbstractRdbmsEntity.AbstractBuilder<LeadRequest, Builder> {

        private String fullName;
        private String email;
        private String phone;
        private RequestType requestType;
        private String preferredModel;
        private String message;
        private LeadRequestStatus status;

        public Builder withFullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public Builder withEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder withPhone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder withRequestType(RequestType requestType) {
            this.requestType = requestType;
            return this;
        }

        public Builder withPreferredModel(String preferredModel) {
            this.preferredModel = preferredModel;
            return this;
        }

        public Builder withMessage(String message) {
            this.message = message;
            return this;
        }

        public Builder withStatus(LeadRequestStatus status) {
            this.status = status;
            return this;
        }

        @Override
        public LeadRequest build() {
            if (getId() >= 0) {
                return new LeadRequest(this, getId());
            }
            return new LeadRequest(this);
        }
    }
}
