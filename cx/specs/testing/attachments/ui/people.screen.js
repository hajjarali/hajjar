// screen mock: People | root: people.Person
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    function cell(id, text, bold) {
        return { id: id, jsontype: "mui.tablecell", props: { children: text, sx: bold ? { fontWeight: 600 } : {} } };
    }
    function headCell(id, text) {
        return { id: id, jsontype: "mui.tablecell", props: { children: text, sx: { fontWeight: 600 } } };
    }
    function button(id, label) {
        return { id: id, jsontype: "mui.button", props: { children: label, size: "small", variant: "outlined" } };
    }
    return { main: function () {
        const root = "people_screen";
        const headRowId = root + "_hr";
        const headRow = { id: headRowId, jsontype: "mui.tablerow", elements: {} };
        const heads = ["Name", "Age", "Gender", ""];
        for (let i = 0; i < heads.length; i++) {
            const h = headCell(headRowId + "_" + i, heads[i]);
            headRow.elements[h.id] = h;
        }
        const head = { id: root + "_head", jsontype: "mui.tablehead", elements: { [headRowId]: headRow } };
        const body = { id: root + "_body", jsontype: "mui.tablebody", elements: {} };
        for (let r = 0; r < rows.size(); r++) {
            const rid = root + "_r" + r;
            const row = { id: rid, jsontype: "mui.tablerow", props: { hover: true }, elements: {} };
            const c1 = cell(rid + "_name", String(rows.get(r).get("name")), true);
            const c2 = cell(rid + "_age", String(rows.get(r).get("age")), false);
            const c3 = cell(rid + "_gender", String(rows.get(r).get("gender")), false);
            const c4 = { id: rid + "_act", jsontype: "mui.tablecell", elements: {} };
            const open = button(rid + "_open", "Open");
            const del = button(rid + "_del", "Delete");
            c4.elements[open.id] = open;
            c4.elements[del.id] = del;
            row.elements[c1.id] = c1; row.elements[c2.id] = c2; row.elements[c3.id] = c3; row.elements[c4.id] = c4;
            body.elements[rid] = row;
        }
        const table = { id: root + "_table", jsontype: "mui.table", props: { size: "small", stickyHeader: true },
            elements: { [head.id]: head, [body.id]: body } };
        const container = { id: root + "_tc", jsontype: "mui.tablecontainer", props: { sx: { flex: 1, overflow: "auto" } },
            elements: { [table.id]: table } };
        const tableRegion = { id: root + "_tableRegion", jsontype: "mui.box",
            props: { sx: { flex: 2, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" } },
            elements: { [container.id]: container } };

        const nameEl = viewUtils.buildUIElement(model.fieldNameToModelId("name"));
        const ageEl = viewUtils.buildUIElement(model.fieldNameToModelId("age"));
        const genderEl = viewUtils.buildUIElement(model.fieldNameToModelId("gender"));
        const panelTitle = { id: root + "_pt", jsontype: "mui.typography", props: { variant: "subtitle1", children: "Selected person", sx: { fontWeight: 600 } } };
        const save = button(root + "_save", "Save");
        const cancel = button(root + "_cancel", "Cancel");
        const actions = { id: root + "_actions", jsontype: "mui.stack", props: { direction: "row", spacing: 1 },
            elements: { [save.id]: save, [cancel.id]: cancel } };
        const panel = { id: root + "_panel", jsontype: "mui.box",
            props: { sx: { flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 2, p: 2, borderLeft: "1px solid", borderColor: "divider", overflow: "auto" } },
            elements: { [panelTitle.id]: panelTitle, [nameEl.id]: nameEl, [ageEl.id]: ageEl, [genderEl.id]: genderEl, [actions.id]: actions } };

        const layout = { id: root + "_layout", jsontype: "mui.box",
            props: { sx: { display: "flex", flex: 1, minHeight: 0, overflow: "hidden" } },
            elements: { [tableRegion.id]: tableRegion, [panel.id]: panel } };
        return { sx: { height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" },
            elements: { [layout.id]: layout } };
    } };
})();