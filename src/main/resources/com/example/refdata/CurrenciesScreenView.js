// Layout of CurrenciesScreenView — the same layout as the spec mock ui/currencies.screen.js (resolved by view class name).
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    function cell(id, text, bold) {
        return { id: id, jsontype: "mui.tablecell", props: { children: String(text), sx: bold ? { fontWeight: 600 } : {} } };
    }
    return { main: function () {
        const root = "cur_screen";
        const hdrCells = {};
        ["Code", "Name", "Rate to USD"].forEach(function (h, i) {
            const c = cell(root + "_h" + i, h, true); hdrCells[c.id] = c; });
        const headRow = { id: root + "_hr", jsontype: "mui.tablerow", elements: hdrCells };
        const head = { id: root + "_head", jsontype: "mui.tablehead", elements: { [headRow.id]: headRow } };
        const bodyRows = {};
        for (let i = 0; i < rows.size(); i++) {
            const r = rows.get(i);
            const cs = {};
            const a = cell(root + "_r" + i + "_a", r.get("code"), true);
            const b = cell(root + "_r" + i + "_b", r.get("name"), false);
            const c = cell(root + "_r" + i + "_c", r.get("rateToUsd"), false);
            cs[a.id] = a; cs[b.id] = b; cs[c.id] = c;
            const row = { id: root + "_r" + i, jsontype: "mui.tablerow", props: { hover: true }, elements: cs };
            bodyRows[row.id] = row;
        }
        const body = { id: root + "_body", jsontype: "mui.tablebody", elements: bodyRows };
        const table = { id: root + "_tbl", jsontype: "mui.table", props: { size: "small" },
            elements: { [head.id]: head, [body.id]: body } };
        const tc = { id: root + "_tc", jsontype: "mui.tablecontainer", elements: { [table.id]: table } };
        const openBtn = { id: root + "_open", jsontype: "mui.button", props: { children: "Open", variant: "outlined", size: "small" } };
        const tableRegion = { id: root + "_treg", jsontype: "mui.box", props: { sx: { flex: 1, overflowY: "auto", minWidth: 0 } },
            elements: { [tc.id]: tc, [openBtn.id]: openBtn } };
        const pt = { id: root + "_pt", jsontype: "mui.typography",
            props: { variant: "subtitle2", children: "Selected currency", sx: { textTransform: "none", mb: 1 } } };
        const saveBtn = { id: root + "_save", jsontype: "mui.button", props: { children: "Save", variant: "contained", size: "small" } };
        const cancelBtn = { id: root + "_cancel", jsontype: "mui.button", props: { children: "Cancel", variant: "text", size: "small" } };
        const btns = { id: root + "_btns", jsontype: "mui.stack", props: { direction: "row", spacing: 1, sx: { mt: 2 } },
            elements: { [saveBtn.id]: saveBtn, [cancelBtn.id]: cancelBtn } };
        const panel = { id: root + "_panel", jsontype: "mui.box",
            props: { sx: { width: 320, flexShrink: 0, p: 2, borderLeft: "1px solid", borderColor: "divider", overflowY: "auto" } },
            elements: { [pt.id]: pt, [btns.id]: btns } };
        const layout = { id: root + "_row", jsontype: "mui.box",
            props: { sx: { display: "flex", height: "100%", width: "100%", overflow: "hidden" } },
            elements: { [tableRegion.id]: tableRegion, [panel.id]: panel } };
        return { sx: { height: "100%", overflow: "hidden" }, elements: { [layout.id]: layout } };
    } };
})();
