package com.example.refdata;

import cyai.middleware.dao.migration.ColumnDef;
import cyai.middleware.dao.migration.IMigration;
import cyai.middleware.dao.migration.IMigrationContext;

@SuppressWarnings("PMD.ClassNamingConventions")
public class Currency_V0_V1 implements IMigration {

    @Override
    public void up(IMigrationContext context) {
        context.ddl().createTable("currency")
                .withSystemColumns()
                .withColumn(ColumnDef.typeString("code", 3).notNull())
                .withColumn(ColumnDef.typeString("name", 255).notNull())
                .withColumn(ColumnDef.typeNumeric("rate_to_usd", 19, 8).notNull())
                .execute();
        context.ddl().addUniqueConstraint("uq_currency_code", "currency").column("code").execute();
    }
}
