// screen mock: Legal entities | root: cdm.base.staticdata.party.LegalEntity
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    function text(id, children, variant, sx) {
        return { id: id, jsontype: "mui.typography", props: { variant: variant || "body2", children: children, sx: sx || {} } };
    }
    function button(id, label) {
        return { id: id, jsontype: "mui.button", props: { variant: "outlined", size: "small", children: label } };
    }
    function region(id, title, children, sx) {
        const t = text(id + "_t", title, "subtitle2", { textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 1 });
        const els = {}; els[t.id] = t;
        for (const c of children) { els[c.id] = c; }
        return { id: id, jsontype: "mui.paper", props: { variant: "outlined", sx: sx || { p: 2 } }, elements: els };
    }
    function row(id, children) {
        const els = {};
        for (const c of children) { els[c.id] = c; }
        return { id: id, jsontype: "mui.stack", props: { direction: "row", spacing: 1, sx: { alignItems: "center" } }, elements: els };
    }
    return { main: function () {
        const root = "le_screen";

        const fName = viewUtils.buildUIElement(model.fieldNameToModelId("name"));
        const fLei = viewUtils.buildUIElement(model.fieldNameToModelId("lei"));
        const fStatus = viewUtils.buildUIElement(model.fieldNameToModelId("status"));
        const searchBtn = button(root + "_search", "Search");
        const filterBar = region(root + "_filter", "Filter bar", [row(root + "_fr", [fName, fLei, fStatus, searchBtn])]);

        const head = { id: root + "_th", jsontype: "mui.tablehead", elements: {} };
        const hr = { id: root + "_thr", jsontype: "mui.tablerow", elements: {} };
        const cols = ["Name", "LEI", "Status", ""];
        for (let i = 0; i < cols.length; i++) {
            const c = { id: root + "_hc" + i, jsontype: "mui.tablecell", props: { children: cols[i] } };
            hr.elements[c.id] = c;
        }
        head.elements[hr.id] = hr;
        const body = { id: root + "_tb", jsontype: "mui.tablebody", elements: {} };
        for (let i = 0; i < rows.size(); i++) {
            const r = rows.get(i);
            const tr = { id: root + "_r" + i, jsontype: "mui.tablerow", elements: {} };
            const vals = [r.get("name"), r.get("lei"), r.get("status")];
            for (let j = 0; j < vals.length; j++) {
                const c = { id: root + "_c" + i + "_" + j, jsontype: "mui.tablecell", props: { children: vals[j] == null ? "" : String(vals[j]) } };
                tr.elements[c.id] = c;
            }
            const act = { id: root + "_ac" + i, jsontype: "mui.tablecell", elements: {} };
            const actRow = row(root + "_ar" + i, [button(root + "_open" + i, "Open"), button(root + "_del" + i, "Delete")]);
            act.elements[actRow.id] = actRow;
            tr.elements[act.id] = act;
            body.elements[tr.id] = tr;
        }
        const table = { id: root + "_tbl", jsontype: "mui.table", props: { size: "small", stickyHeader: true }, elements: {} };
        table.elements[head.id] = head; table.elements[body.id] = body;
        const tc = { id: root + "_tc", jsontype: "mui.tablecontainer", props: { sx: { flex: 1, minHeight: 0, overflowY: "auto" } }, elements: {} };
        tc.elements[table.id] = table;
        const tableRegion = region(root + "_table", "Table", [tc],
            { p: 2, display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" });

        const panelHint = text(root + "_ph", "The selected row's default form opens here.", "body2", { color: "text.secondary", textTransform: "none", mb: 1 });
        const panelRegion = region(root + "_panel", "Side panel",
            [panelHint, row(root + "_pb", [button(root + "_save", "Save"), button(root + "_cancel", "Cancel")])],
            { p: 2, overflowY: "auto", height: "100%" });

        const left = { id: root + "_left", jsontype: "mui.stack", props: { spacing: 2, sx: { flex: 2, minWidth: 0, height: "100%", overflow: "hidden" } }, elements: {} };
        left.elements[filterBar.id] = filterBar; left.elements[tableRegion.id] = tableRegion;
        const right = { id: root + "_right", jsontype: "mui.box", props: { sx: { flex: 1, minWidth: 0, height: "100%", overflow: "hidden" } }, elements: {} };
        right.elements[panelRegion.id] = panelRegion;
        const main = { id: root + "_main", jsontype: "mui.stack",
            props: { direction: "row", spacing: 2, sx: { p: 2, width: "100%", height: "100%", boxSizing: "border-box", overflow: "hidden" } }, elements: {} };
        main.elements[left.id] = left; main.elements[right.id] = right;
        return { sx: { width: "100%", height: "100%", overflow: "hidden" }, elements: { [main.id]: main } };
    } };
})();