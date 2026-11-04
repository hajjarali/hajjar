package cyai.sales.lead;

import com.fasterxml.jackson.annotation.JsonTypeName;
import cyai.common.json.enums.IDisplayableEnum;

/** Where a lead request stands: new, contacted, closed. */
@JsonTypeName("leadRequestStatus")
public enum LeadRequestStatus implements IDisplayableEnum {
    NEW("NEW", "New"),
    CONTACTED("CONTACTED", "Contacted"),
    CLOSED("CLOSED", "Closed");

    private final String value;
    private final String label;

    LeadRequestStatus(String value, String label) {
        this.value = value;
        this.label = label;
    }

    @Override
    public String getValue() {
        return value;
    }

    @Override
    public String getLabel() {
        return label;
    }
}
