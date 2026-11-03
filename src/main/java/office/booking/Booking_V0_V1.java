package office.booking;

import cyai.middleware.dao.migration.ColumnDef;
import cyai.middleware.dao.migration.IMigration;
import cyai.middleware.dao.migration.IMigrationContext;

/**
 * Creates the {@code booking_booking} table (V0 -&gt; V1).
 */
@SuppressWarnings("PMD.ClassNamingConventions")
public class Booking_V0_V1 implements IMigration {

    @Override
    public void up(IMigrationContext context) {
        context.ddl().createTable("booking_booking")
                .withSystemColumns()
                .withColumn(ColumnDef.typeLong("room_id").notNull())
                .withColumn(ColumnDef.typeString("title", 200).notNull())
                .withColumn(ColumnDef.typeString("organiser_email", 254).notNull())
                .withColumn(ColumnDef.typeDateTime("start_time").notNull())
                .withColumn(ColumnDef.typeDateTime("end_time").notNull())
                .withColumn(ColumnDef.typeInteger("attendees").notNull())
                .withColumn(ColumnDef.typeEnum("status", 20).notNull())
                .execute();
        context.ddl().addPrimaryKey("pk_booking_booking", "booking_booking")
                .column("id")
                .execute();
        context.ddl().addIndex("ix_booking_booking_room_start", "booking_booking")
                .column("room_id")
                .column("start_time")
                .execute();
    }
}
