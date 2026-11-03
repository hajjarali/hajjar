package office.booking;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;
import cyai.common.json.IJsonObject;
import cyai.common.json.JsonTypesLoader;
import cyai.entity.desc.EntityDescriptor;
import cyai.entity.desc.EntityDescriptorClassLoader;
import cyai.validation.BeanValidationError;
import cyai.validation.IBeanContext;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class RoomTest {

    private static Room room(String name, int capacity, List<Equipment> equipment) {
        return Room.builder().withName(name).withFloor(3).withCapacity(capacity).withEquipment(equipment).build();
    }

    @Test
    void a6_roomWithCapacity12AndAnyEquipmentRoundTrips() throws Exception {
        ObjectMapper mapper = new JsonTypesLoader.Builder()
                .withClassLoader(getClass().getClassLoader()).build().getObjectMapper();
        List<List<Equipment>> combinations = List.of(
                List.of(),
                List.of(Equipment.SCREEN),
                List.of(Equipment.WHITEBOARD, Equipment.VIDEO_CALL_KIT),
                List.of(Equipment.SCREEN, Equipment.WHITEBOARD, Equipment.VIDEO_CALL_KIT));
        for (List<Equipment> combination : combinations) {
            Room atlas = room("Atlas", 12, combination);
            String json = mapper.writeValueAsString(atlas);
            assertTrue(json.contains("\"jsontype\":\"office.booking.room\""));
            Room back = (Room) mapper.readValue(json, IJsonObject.class);
            assertEquals(atlas, back);
            assertEquals(12, back.getCapacity());
            assertEquals(combination, back.getEquipment());
        }
    }

    @Test
    void capacityZeroIsRefused() {
        IBeanContext ctx = Mockito.mock(IBeanContext.class);
        Mockito.when(ctx.get("capacity", Integer.class)).thenReturn(0);
        List<BeanValidationError> errors = new RoomValidator().validate(ctx);
        assertEquals(1, errors.size());
        assertEquals("capacity", errors.get(0).getField());
        assertTrue(errors.get(0).isBlocking());
    }

    @Test
    void capacityOfOneOrMoreIsAccepted() {
        IBeanContext ctx = Mockito.mock(IBeanContext.class);
        Mockito.when(ctx.get("capacity", Integer.class)).thenReturn(12);
        assertTrue(new RoomValidator().validate(ctx).isEmpty());
    }

    @Test
    void descriptorDeclaresUniqueRequiredNameAndUniqueConstraintInMigration() {
        EntityDescriptor descriptor = new EntityDescriptorClassLoader().load().stream()
                .filter(d -> Room.ENTITY_NAME.equals(d.getName()))
                .findFirst().orElseThrow();
        var validation = descriptor.getFieldDescriptors().get("name").getValidationDescriptor();
        assertTrue(validation.isUnique());
        assertEquals(1, descriptor.getVersion());
    }
}
