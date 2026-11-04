// screen mock: Lead requests | root: sales.lead.LeadRequest
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    function box(id, title, children, sx) {
        const els = {};
        const t = { id: id + "_t", jsontype: "mui.typography", props: { variant: "subtitle2", children: title, sx: { color: "text.secondary", mb: 1 } } };
        els[t.id] = t;
        for (const c of children) { els[c.id] = c; }
        return { id: id, jsontype: "mui.box", props: { sx: sx }, elements: els };
    }
    function btn(id, label) {
        return { id: id, jsontype: "mui.button", props: { children: label, variant: "outlined", size: "small" } };
    }
    function cell(id, text, head) {
        return { id: id, jsontype: "mui.tablecell", props: { children: text, sx: head ? { fontWeight: 600 } : {} } };
    }
    return { main: function () {
        const root = "lr";
        const frame = { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 };
        const fRT = viewUtils.buildUIElement(model.fieldNameToModelId("requestType"));
        const fSt = viewUtils.buildUIElement(model.fieldNameToModelId("status"));
        const fPM = viewUtils.buildUIElement(model.fieldNameToModelId("preferredModel"));
        const search = btn(root + "_search", "Search");
        const frow = { id: root + "_frow", jsontype: "mui.stack", props: { direction: "row", spacing: 2, sx: { alignItems: "center" } },
              elements: { [fRT.id]: fRT, [fSt.id]: fSt, [fPM.id]: fPM, [search.id]: search } };
        const filter = box(root + "_filter", "Filter bar", [frow], frame);

        const cols = ["Full name", "Email", "Phone", "Request type", "Preferred model", "Status", "Actions"];
        const headCells = {};
        for (let i = 0; i < cols.length; i++) { const c = cell(root + "_h" + i, cols[i], true); headCells[c.id] = c; }
        const headRow = { id: root + "_hr", jsontype: "mui.tablerow", elements: headCells };
        const bodyRows = {};
        const names = ["fullName", "email", "phone", "requestType", "preferredModel", "status"];
        for (let r = 0; r < rows.size(); r++) {
            const cells = {};
            for (let i = 0; i < names.length; i++) {
                const v = rows.get(r).get(names[i]);
                const c = cell(root + "_c" + r + "_" + i, v == null ? "" : String(v), false);
                cells[c.id] = c;
            }
            const open = btn(root + "_open" + r, "Open");
            const del = btn(root + "_del" + r, "Delete");
            const ac = { id: root + "_ac" + r, jsontype: "mui.tablecell", elements: { [open.id]: open, [del.id]: del } };
            cells[ac.id] = ac;
            bodyRows[root + "_r" + r] = { id: root + "_r" + r, jsontype: "mui.tablerow", elements: cells };
        }
        const table = { id: root + "_tbl", jsontype: "mui.table", props: { size: "small" }, elements: {
            [root + "_th"]: { id: root + "_th", jsontype: "mui.tablehead", elements: { [headRow.id]: headRow } },
            [root + "_tb"]: { id: root + "_tb", jsontype: "mui.tablebody", elements: bodyRows } } };
        const tc = { id: root + "_tc", jsontype: "mui.tablecontainer", props: { sx: { flex: 1, minHeight: 0, overflowY: "auto" } }, elements: { [table.id]: table } };
        const tableBox = box(root + "_table", "Table", [tc], { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" });

        const save = btn(root + "_save", "Save"); const cancel = btn(root + "_cancel", "Cancel");
        const panelText = { id: root + "_pt", jsontype: "mui.typography", props: { variant: "body2", children: "The selected request's default form", sx: { color: "text.secondary", mb: 1 } } };
        const actions = { id: root + "_pa", jsontype: "mui.stack", props: { direction: "row", spacing: 1 }, elements: { [save.id]: save, [cancel.id]: cancel } };
        const panel = box(root + "_panel", "Side panel", [panelText, actions], { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2, flex: 1, minHeight: 0, overflowY: "auto" });
        const left = { id: root + "_left", jsontype: "mui.stack", props: { spacing: 2, sx: { flex: 3, height: "100%", minHeight: 0 } }, elements: { [filter.id]: filter, [tableBox.id]: tableBox } };
        const main = { id: root + "_main", jsontype: "mui.stack", props: { direction: "row", spacing: 2, sx: { height: "100%", width: "100%", minHeight: 0 } },
                elements: { [left.id]: left, [panel.id]: panel } };
        return { sx: { p: 2, height: "100%", width: "100%", overflow: "hidden" }, elements: { [main.id]: main } };
    } };
})();