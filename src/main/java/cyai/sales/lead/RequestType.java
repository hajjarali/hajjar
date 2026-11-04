package cyai.sales.lead;

import com.fasterxml.jackson.annotation.JsonTypeName;
import cyai.common.json.enums.IDisplayableEnum;

/** What a visitor asks the dealer for through the landing page form. */
@JsonTypeName("requestType")
public enum RequestType implements IDisplayableEnum {
    TEST_DRIVE("TEST_DRIVE", "Test drive"),
    QUOTE("QUOTE", "Quote");

    private final String value;
    private final String label;

    RequestType(String value, String label) {
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
