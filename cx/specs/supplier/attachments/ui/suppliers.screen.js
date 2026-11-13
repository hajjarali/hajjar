// screen mock: Suppliers | root: procurement.Supplier
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    function cell(id, text, grey) {
        return { id: id, jsontype: "mui.tablecell", props: { children: text, sx: grey ? { color: "text.disabled" } : {} } };
    }
    return { main: function () {
        const body = {};
        for (let i = 0; i < rows.size(); i++) {
            const r = rows.get(i);
            const rid = "row_" + i;
            const grey = i === rows.size() - 1;
            const cells = {};
            const c1 = cell(rid + "_n", r.get("name"), grey);
            const c2 = cell(rid + "_e", r.get("contactEmail"), grey);
            const c3 = cell(rid + "_c", r.get("country"), grey);
            const c4 = cell(rid + "_a", grey ? "No" : "Yes", grey);
            cells[c1.id] = c1; cells[c2.id] = c2; cells[c3.id] = c3; cells[c4.id] = c4;
            body[rid] = { id: rid, jsontype: "mui.tablerow", props: { hover: true }, elements: cells };
        }
        const headCells = {};
        const labels = ["Name", "Contact email", "Country", "Active"];
        for (let j = 0; j < labels.length; j++) {
            const h = { id: "h_" + j, jsontype: "mui.tablecell", props: { children: labels[j], sx: { fontWeight: 600 } } };
            headCells[h.id] = h;
        }
        const head = { id: "thead", jsontype: "mui.tablehead", elements: {
            hrow: { id: "hrow", jsontype: "mui.tablerow", elements: headCells } } };
        const tbody = { id: "tbody", jsontype: "mui.tablebody", elements: body };
        const table = { id: "table", jsontype: "mui.table", props: { size: "small", stickyHeader: true },
            elements: { thead: head, tbody: tbody } };
        const tc = { id: "tc", jsontype: "mui.tablecontainer", props: { sx: { flex: 1, overflowY: "auto" } },
            elements: { table: table } };
        const addBtn = { id: "add", jsontype: "mui.button", props: { children: "Add supplier", variant: "contained", size: "small" } };
        const openBtn = { id: "open", jsontype: "mui.button", props: { children: "Open", variant: "outlined", size: "small" } };
        const tableRegion = { id: "region_table", jsontype: "mui.box",
            props: { sx: { flex: 2, display: "flex", flexDirection: "column", minWidth: 0, height: "100%" } },
            elements: {
                tbar: { id: "tbar", jsontype: "mui.box", props: { sx: { display: "flex", gap: 1, p: 1 } },
                    elements: { add: addBtn, open: openBtn } },
                tc: tc } };
        const saveBtn = { id: "save", jsontype: "mui.button", props: { children: "Save", variant: "contained", size: "small" } };
        const cancelBtn = { id: "cancel", jsontype: "mui.button", props: { children: "Cancel", variant: "outlined", size: "small" } };
        const nameField = viewUtils.buildUIElement(model.fieldNameToModelId("name"));
        const emailField = viewUtils.buildUIElement(model.fieldNameToModelId("contactEmail"));
        const countryField = viewUtils.buildUIElement(model.fieldNameToModelId("country"));
        const activeField = viewUtils.buildUIElement(model.fieldNameToModelId("active"));
        const panel = { id: "region_panel", jsontype: "mui.box",
            props: { sx: { flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 2, p: 2, borderLeft: "1px solid", borderColor: "divider", overflowY: "auto" } },
            elements: {
                ptitle: { id: "ptitle", jsontype: "mui.typography", props: { variant: "subtitle1", children: "Supplier", sx: { fontWeight: 600 } } },
                [nameField.id]: nameField, [emailField.id]: emailField, [countryField.id]: countryField, [activeField.id]: activeField,
                pbtns: { id: "pbtns", jsontype: "mui.box", props: { sx: { display: "flex", gap: 1 } },
                    elements: { save: saveBtn, cancel: cancelBtn } } } };
        const root = { id: "root", jsontype: "mui.box",
            props: { sx: { display: "flex", height: "100%", width: "100%", overflow: "hidden" } },
            elements: { region_table: tableRegion, region_panel: panel } };
        return { sx: { height: "100%", overflow: "hidden" }, elements: { root: root } };
    } };
})();