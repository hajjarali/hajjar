// screen mock: Rooms | root: office.booking.Room
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    return { main: function () {
        const root = "rooms_screen";
        const n = rows.size();

        const head = { id: root + "_th", jsontype: "mui.tablehead", elements: {} };
        const headRow = { id: root + "_thr", jsontype: "mui.tablerow", elements: {} };
        const cols = ["Name", "Floor", "Capacity", "Equipment"];
        for (let c = 0; c < cols.length; c++) {
            const cell = { id: root + "_thc" + c, jsontype: "mui.tablecell", props: { children: cols[c], sx: { color: "text.secondary", textTransform: "none", borderBottom: "1px solid", borderColor: "divider" } } };
            headRow.elements[cell.id] = cell;
        }
        head.elements[headRow.id] = headRow;
        const body = { id: root + "_tb", jsontype: "mui.tablebody", elements: {} };
        for (let i = 0; i < n; i++) {
            const r = rows.get(i);
            const tr = { id: root + "_tr" + i, jsontype: "mui.tablerow", props: { hover: true }, elements: {} };
            const vals = [r.get("name"), r.get("floor"), r.get("capacity"), r.get("equipment")];
            for (let c = 0; c < vals.length; c++) {
                const v = vals[c];
                const cell = { id: root + "_tc" + i + "_" + c, jsontype: "mui.tablecell", props: { children: (v === null || v === undefined) ? "" : String(v), sx: { borderBottom: "1px solid", borderColor: "divider" } } };
                tr.elements[cell.id] = cell;
            }
            body.elements[tr.id] = tr;
        }
        const table = { id: root + "_table", jsontype: "mui.table", elements: { [head.id]: head, [body.id]: body } };
        const tableContainer = { id: root + "_tablec", jsontype: "mui.tablecontainer", props: { sx: { flex: 1, overflowY: "auto" } }, elements: { [table.id]: table } };

        const newBtn = { id: root + "_new", jsontype: "mui.button", props: { children: "New", variant: "text" } };
        const openBtn = { id: root + "_open", jsontype: "mui.button", props: { children: "Open", variant: "text" } };
        const delBtn = { id: root + "_del", jsontype: "mui.button", props: { children: "Delete", variant: "text", color: "error" } };
        const actions = { id: root + "_actions", jsontype: "mui.stack", props: { direction: "row", spacing: 1, sx: { mb: 1 } },
            elements: { [newBtn.id]: newBtn, [openBtn.id]: openBtn, [delBtn.id]: delBtn } };
        const tableRegion = { id: root + "_tableregion", jsontype: "mui.box", props: { sx: { flex: 2, minWidth: 0, display: "flex", flexDirection: "column", minHeight: 0 } },
            elements: { [actions.id]: actions, [tableContainer.id]: tableContainer } };

        const nameEl = viewUtils.buildUIElement(model.fieldNameToModelId("name"));
        const floorEl = viewUtils.buildUIElement(model.fieldNameToModelId("floor"));
        const capEl = viewUtils.buildUIElement(model.fieldNameToModelId("capacity"));
        const eqEl = viewUtils.buildUIElement(model.fieldNameToModelId("equipment"));
        const panelTitle = { id: root + "_ptitle", jsontype: "mui.typography", props: { variant: "h6", children: "Selected room", sx: { fontWeight: 700, textTransform: "none", mb: 2 } } };
        const saveBtn = { id: root + "_save", jsontype: "mui.button", props: { children: "Save", variant: "contained" } };
        const cancelBtn = { id: root + "_cancel", jsontype: "mui.button", props: { children: "Cancel", variant: "text" } };
        const btns = { id: root + "_pbtns", jsontype: "mui.stack", props: { direction: "row", spacing: 1, sx: { mt: 2 } },
            elements: { [saveBtn.id]: saveBtn, [cancelBtn.id]: cancelBtn } };
        const panel = { id: root + "_panel", jsontype: "mui.box", props: { sx: { flex: 1, minWidth: 260, p: 3, borderLeft: "1px solid", borderColor: "divider", overflowY: "auto" } },
            elements: { [panelTitle.id]: panelTitle, [nameEl.id]: nameEl, [floorEl.id]: floorEl, [capEl.id]: capEl, [eqEl.id]: eqEl, [btns.id]: btns } };

        const layout = { id: root + "_layout", jsontype: "mui.box", props: { sx: { display: "flex", height: "100%", width: "100%", p: 3, gap: 3, boxSizing: "border-box" } },
            elements: { [tableRegion.id]: tableRegion, [panel.id]: panel } };
        return { sx: { height: "100%", width: "100%", overflow: "hidden" }, elements: { [layout.id]: layout } };
    } };
})();
