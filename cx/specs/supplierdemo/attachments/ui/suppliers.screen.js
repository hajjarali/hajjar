// screen mock: Suppliers | root: procurement.Supplier
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    return { main: function () {
        const root = "suppliers_screen";
        function text(id, str, extra) {
            const sx = { fontWeight: 600 };
            return { id: id, jsontype: "mui.typography", props: { variant: "subtitle1", children: str, sx: sx } };
        }
        // table region
        const headCells = {};
        const cols = ["Name", "Contact email", "Country", "Active"];
        for (let c = 0; c < cols.length; c++) {
            const hid = root + "_h" + c;
            headCells[hid] = { id: hid, jsontype: "mui.tablecell", props: { children: cols[c] } };
        }
        const headRow = { id: root + "_hr", jsontype: "mui.tablerow", elements: headCells };
        const head = { id: root + "_head", jsontype: "mui.tablehead", elements: { [headRow.id]: headRow } };
        const bodyRows = {};
        const keys = ["name", "contactEmail", "country", "active"];
        for (let i = 0; i < rows.size(); i++) {
            const r = rows.get(i);
            const cells = {};
            const inactive = String(r.get("active")) === "false";
            for (let c = 0; c < keys.length; c++) {
                const cid = root + "_r" + i + "_c" + c;
                cells[cid] = { id: cid, jsontype: "mui.tablecell",
                    props: { children: String(r.get(keys[c])), sx: inactive ? { color: "text.disabled" } : {} } };
            }
            const rid = root + "_r" + i;
            bodyRows[rid] = { id: rid, jsontype: "mui.tablerow", props: { hover: true }, elements: cells };
        }
        const body = { id: root + "_body", jsontype: "mui.tablebody", elements: bodyRows };
        const table = { id: root + "_table", jsontype: "mui.table", props: { size: "small" },
            elements: { [head.id]: head, [body.id]: body } };
        const tc = { id: root + "_tc", jsontype: "mui.tablecontainer", props: { sx: { flex: 1, overflowY: "auto" } },
            elements: { [table.id]: table } };
        const addBtn = { id: root + "_add", jsontype: "mui.button", props: { variant: "contained", children: "Add" } };
        const openBtn = { id: root + "_open", jsontype: "mui.button", props: { variant: "outlined", children: "Open" } };
        const actions = { id: root + "_act", jsontype: "mui.stack", props: { direction: "row", spacing: 1, sx: { mb: 1 } },
            elements: { [addBtn.id]: addBtn, [openBtn.id]: openBtn } };
        const tableTitle = text(root + "_tt", "Suppliers (sorted by name)");
        const tableRegion = { id: root + "_tr", jsontype: "mui.paper",
            props: { variant: "outlined", sx: { flex: 2, p: 2, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" } },
            elements: { [tableTitle.id]: tableTitle, [actions.id]: actions, [tc.id]: tc } };
        // side panel
        const nameEl = viewUtils.buildUIElement(model.fieldNameToModelId("name"));
        const emailEl = viewUtils.buildUIElement(model.fieldNameToModelId("contactEmail"));
        const countryEl = viewUtils.buildUIElement(model.fieldNameToModelId("country"));
        const activeEl = viewUtils.buildUIElement(model.fieldNameToModelId("active"));
        const panelTitle = text(root + "_pt", "Supplier");
        const saveBtn = { id: root + "_save", jsontype: "mui.button", props: { variant: "contained", children: "Save" } };
        const cancelBtn = { id: root + "_cancel", jsontype: "mui.button", props: { variant: "text", children: "Cancel" } };
        const panelActions = { id: root + "_pa", jsontype: "mui.stack", props: { direction: "row", spacing: 1 },
            elements: { [saveBtn.id]: saveBtn, [cancelBtn.id]: cancelBtn } };
        const form = { id: root + "_form", jsontype: "mui.stack", props: { spacing: 2, sx: { flex: 1, overflowY: "auto", py: 1 } },
            elements: { [nameEl.id]: nameEl, [emailEl.id]: emailEl, [countryEl.id]: countryEl, [activeEl.id]: activeEl } };
        const panel = { id: root + "_panel", jsontype: "mui.paper",
            props: { variant: "outlined", sx: { flex: 1, p: 2, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" } },
            elements: { [panelTitle.id]: panelTitle, [form.id]: form, [panelActions.id]: panelActions } };
        const container = { id: root + "_root", jsontype: "mui.box",
            props: { sx: { display: "flex", gap: 2, height: "100%", width: "100%", p: 2, boxSizing: "border-box", overflow: "hidden" } },
            elements: { [tableRegion.id]: tableRegion, [panel.id]: panel } };
        return { sx: { height: "100%", overflow: "hidden" }, elements: { [container.id]: container } };
    } };
})();