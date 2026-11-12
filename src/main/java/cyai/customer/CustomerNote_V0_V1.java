package cyai.customer;

import cyai.middleware.dao.migration.ColumnDef;
import cyai.middleware.dao.migration.IMigration;
import cyai.middleware.dao.migration.IMigrationContext;

/** Initial migration: creates the customer_note table. */
@SuppressWarnings("PMD.ClassNamingConventions")
public class CustomerNote_V0_V1 implements IMigration {

    @Override
    public void up(IMigrationContext context) {
        context.ddl().createTable("customer_note")
                .withSystemColumns()
                .withColumn(ColumnDef.typeString("customer_name", 255).notNull())
                .withColumn(ColumnDef.typeString("note_text", 4000).notNull())
                .withColumn(ColumnDef.typeDate("created_date"))
                .execute();
    }
}
