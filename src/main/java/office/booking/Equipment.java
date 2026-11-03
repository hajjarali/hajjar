package office.booking;

import com.fasterxml.jackson.annotation.JsonTypeName;
import cyai.common.json.enums.IDisplayableEnum;

/**
 * Equipment a meeting room offers.
 */
@JsonTypeName("office.booking.equipment")
public enum Equipment implements IDisplayableEnum {
    SCREEN("screen", "Screen"),
    WHITEBOARD("whiteboard", "Whiteboard"),
    VIDEO_CALL_KIT("videoCallKit", "Video call kit");

    private final String value;
    private final String label;

    Equipment(String value, String label) {
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
