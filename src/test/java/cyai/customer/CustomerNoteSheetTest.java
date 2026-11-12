package cyai.customer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

import cyai.entitymgr.IEntityManager;
import cyai.entitymgr.IEntityManagers;
import cyai.entitymgr.IEntityQuery;
import java.lang.reflect.Proxy;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.junit.jupiter.api.Test;

class CustomerNoteSheetTest {

    /** A query over an in-memory list that honours orderByDesc on createdDate. */
    private static IEntityManagers managersOver(List<CustomerNote> rows) {
        IEntityQuery<?> query = (IEntityQuery<?>) Proxy.newProxyInstance(
                IEntityQuery.class.getClassLoader(), new Class<?>[] {IEntityQuery.class},
                new java.lang.reflect.InvocationHandler() {
                    private boolean desc;

                    @Override
                    public Object invoke(Object proxy, java.lang.reflect.Method m, Object[] args) {
                        switch (m.getName()) {
                            case "orderByDesc":
                                desc = "createdDate".equals(args[0]);
                                return proxy;
                            case "list":
                                List<CustomerNote> out = new ArrayList<>(rows);
                                if (desc) {
                                    out.sort(Comparator.comparing(CustomerNote::getCreatedDate).reversed());
                                }
                                return out;
                            default:
                                throw new UnsupportedOperationException(m.getName());
                        }
                    }
                });
        IEntityManager<?> manager = (IEntityManager<?>) Proxy.newProxyInstance(
                IEntityManager.class.getClassLoader(), new Class<?>[] {IEntityManager.class},
                (proxy, m, args) -> {
                    if ("query".equals(m.getName())) {
                        return query;
                    }
                    throw new UnsupportedOperationException(m.getName());
                });
        return (IEntityManagers) Proxy.newProxyInstance(
                IEntityManagers.class.getClassLoader(), new Class<?>[] {IEntityManagers.class},
                (proxy, m, args) -> {
                    if ("of".equals(m.getName())) {
                        return manager;
                    }
                    throw new UnsupportedOperationException(m.getName());
                });
    }

    @Test
    void a2_afterSavingTwoNotesTheListShowsTheNewerFirst() throws Exception {
        CustomerNote older = CustomerNote.builder().withCustomerName("Acme").withNoteText("first")
                .withCreatedDate(LocalDate.of(2026, 1, 1)).build();
        CustomerNote newer = CustomerNote.builder().withCustomerName("Acme").withNoteText("second")
                .withCreatedDate(LocalDate.of(2026, 2, 1)).build();

        List<?> listed = new CustomerNoteSheet().list("call", null, managersOver(List.of(older, newer)), null);

        assertEquals(2, listed.size());
        assertSame(newer, listed.get(0));
        assertSame(older, listed.get(1));
    }
}
