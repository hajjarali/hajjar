package cyai.sales.lead;

import cyai.middleware.dao.migration.ColumnDef;
import cyai.middleware.dao.migration.IMigration;
import cyai.middleware.dao.migration.IMigrationContext;

/** Creates the {@code lead_request} table (V0 to V1). */
@SuppressWarnings("PMD.ClassNamingConventions")
public class LeadRequest_V0_V1 implements IMigration {

    @Override
    public void up(IMigrationContext context) {
        context.ddl().createTable("lead_request")
                .withSystemColumns()
                .withColumn(ColumnDef.typeString("full_name", 200).notNull())
                .withColumn(ColumnDef.typeString("email", 254).notNull())
                .withColumn(ColumnDef.typeString("phone", 40))
                .withColumn(ColumnDef.typeEnum("request_type", 20).notNull())
                .withColumn(ColumnDef.typeString("preferred_model", 120))
                .withColumn(ColumnDef.typeString("message", 4000))
                .withColumn(ColumnDef.typeEnum("status", 20).notNull())
                .execute();
        context.ddl().addPrimaryKey("pk_lead_request", "lead_request").column("id").execute();
        context.ddl().addIndex("ix_lead_request_status", "lead_request").column("status").execute();
        context.ddl().addIndex("ix_lead_request_type", "lead_request").column("request_type").execute();
    }
}
