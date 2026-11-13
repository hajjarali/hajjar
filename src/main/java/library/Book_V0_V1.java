package library;

import cyai.middleware.dao.migration.ColumnDef;
import cyai.middleware.dao.migration.IMigration;
import cyai.middleware.dao.migration.IMigrationContext;

/** Creates the library_book table. */
@SuppressWarnings("PMD.ClassNamingConventions")
public class Book_V0_V1 implements IMigration {

    @Override
    public void up(IMigrationContext context) {
        context.ddl().createTable("library_book")
                .withSystemColumns()
                .withColumn(ColumnDef.typeString("title", 255).notNull())
                .withColumn(ColumnDef.typeString("author", 255))
                .withColumn(ColumnDef.typeInteger("rating"))
                .withColumn(ColumnDef.typeBoolean("is_read"))
                .execute();
        context.ddl().addIndex("ix_library_book_by_rating", "library_book").column("rating").execute();
    }
}
