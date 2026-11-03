package office.booking;

import cyai.middleware.dao.migration.ColumnDef;
import cyai.middleware.dao.migration.IMigration;
import cyai.middleware.dao.migration.IMigrationContext;

/**
 * Creates the {@code booking_room} table (V0 -&gt; V1).
 */
@SuppressWarnings("PMD.ClassNamingConventions")
public class Room_V0_V1 implements IMigration {

    @Override
    public void up(IMigrationContext context) {
        context.ddl().createTable("booking_room")
                .withSystemColumns()
                .withColumn(ColumnDef.typeString("name", 120).notNull())
                .withColumn(ColumnDef.typeInteger("floor").notNull())
                .withColumn(ColumnDef.typeInteger("capacity").notNull())
                .withColumn(ColumnDef.typeObject("equipment"))
                .execute();
        context.ddl().addPrimaryKey("pk_booking_room", "booking_room")
                .column("id")
                .execute();
        context.ddl().addUniqueConstraint("uq_booking_room_name", "booking_room")
                .column("name")
                .execute();
    }
}
