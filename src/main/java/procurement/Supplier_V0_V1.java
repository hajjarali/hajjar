package procurement;

import cyai.middleware.dao.migration.ColumnDef;
import cyai.middleware.dao.migration.IMigration;
import cyai.middleware.dao.migration.IMigrationContext;

/** Initial migration: creates the supplier table. */
@SuppressWarnings("PMD.ClassNamingConventions")
public class Supplier_V0_V1 implements IMigration {

    @Override
    public void up(IMigrationContext context) {
        context.ddl().createTable("supplier")
                .withSystemColumns()
                .withColumn(ColumnDef.typeString("name", 255).notNull())
                .withColumn(ColumnDef.typeString("contact_email", 255))
                .withColumn(ColumnDef.typeString("country", 100))
                .withColumn(ColumnDef.typeBoolean("active").notNull())
                .execute();
    }
}
