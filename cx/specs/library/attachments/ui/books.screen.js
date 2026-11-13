// screen mock: Books | root: library.Book
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    return { main: function () {
        const root = "books_root";
        const headId = root + "_head";
        const headRow = { id: headId + "_r", jsontype: "mui.tablerow", elements: {} };
        const cols = ["Title", "Author", "Rating", "Read"];
        for (let c = 0; c < cols.length; c++) {
            const cell = { id: headId + "_c" + c, jsontype: "mui.tablecell", props: { children: cols[c] } };
            headRow.elements[cell.id] = cell;
        }
        const head = { id: headId, jsontype: "mui.tablehead", elements: { [headRow.id]: headRow } };
        const body = { id: root + "_body", jsontype: "mui.tablebody", elements: {} };
        for (let i = 0; i < rows.size(); i++) {
            const r = rows.get(i);
            const rid = root + "_row" + i;
            const isRead = String(r.get("read")) === "true";
            const row = { id: rid, jsontype: "mui.tablerow", props: { hover: true, sx: { opacity: isRead ? 0.5 : 1 } }, elements: {} };
            const vals = [r.get("title"), r.get("author"), r.get("rating"), r.get("read")];
            for (let c = 0; c < vals.length; c++) {
                const cell = { id: rid + "_c" + c, jsontype: "mui.tablecell", props: { children: String(vals[c]) } };
                row.elements[cell.id] = cell;
            }
            body.elements[row.id] = row;
        }
        const table = { id: root + "_tbl", jsontype: "mui.table", props: { size: "small" },
            elements: { [head.id]: head, [body.id]: body } };
        const container = { id: root + "_tc", jsontype: "mui.tablecontainer", props: { sx: { flex: 1, overflowY: "auto" } },
            elements: { [table.id]: table } };

        const addBtn = { id: root + "_add", jsontype: "mui.button", props: { variant: "contained", children: "Add" } };
        const openBtn = { id: root + "_open", jsontype: "mui.button", props: { variant: "outlined", children: "Open" } };
        const delBtn = { id: root + "_del", jsontype: "mui.button", props: { variant: "outlined", color: "error", children: "Delete" } };
        const actions = { id: root + "_act", jsontype: "mui.stack", props: { direction: "row", spacing: 1 },
            elements: { [addBtn.id]: addBtn, [openBtn.id]: openBtn, [delBtn.id]: delBtn } };
        const tableRegion = { id: root + "_tr", jsontype: "mui.paper", props: { variant: "outlined", sx: { flex: 2, p: 2, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" } },
            elements: { [actions.id]: actions, [container.id]: container } };

        const pTitle = { id: root + "_pt", jsontype: "mui.typography", props: { variant: "subtitle2", children: "Selected book" } };
        const f1 = viewUtils.buildUIElement(model.fieldNameToModelId("title"));
        const f2 = viewUtils.buildUIElement(model.fieldNameToModelId("author"));
        const f3 = viewUtils.buildUIElement(model.fieldNameToModelId("rating"));
        const f4 = viewUtils.buildUIElement(model.fieldNameToModelId("read"));
        const saveBtn = { id: root + "_save", jsontype: "mui.button", props: { variant: "contained", children: "Save" } };
        const cancelBtn = { id: root + "_cancel", jsontype: "mui.button", props: { variant: "text", children: "Cancel" } };
        const panelActions = { id: root + "_pa", jsontype: "mui.stack", props: { direction: "row", spacing: 1 },
            elements: { [saveBtn.id]: saveBtn, [cancelBtn.id]: cancelBtn } };
        const panel = { id: root + "_panel", jsontype: "mui.paper", props: { variant: "outlined", sx: { flex: 1, p: 2, display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", minWidth: 0 } },
            elements: { [pTitle.id]: pTitle, [f1.id]: f1, [f2.id]: f2, [f3.id]: f3, [f4.id]: f4, [panelActions.id]: panelActions } };

        const main = { id: root + "_main", jsontype: "mui.box", props: { sx: { display: "flex", flexDirection: "row", gap: 2, height: "100%", width: "100%", overflow: "hidden", p: 2, boxSizing: "border-box" } },
            elements: { [tableRegion.id]: tableRegion, [panel.id]: panel } };
        return { sx: { height: "100%", overflow: "hidden" }, elements: { [main.id]: main } };
    } };
})();