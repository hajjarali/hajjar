// screen mock: Customer notes | root: customer.CustomerNote
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    function cell(id, text, sx) {
        return { id: id, jsontype: "mui.tablecell", props: { children: text, sx: sx || {} } };
    }
    function btn(id, label) {
        return { id: id, jsontype: "mui.button", props: { children: label, size: "small", variant: "outlined" } };
    }
    return { main: function () {
        const root = "cn_root";
        const headRow = { id: "cn_hr", jsontype: "mui.tablerow", elements: {} };
        const heads = ["Customer name", "Note text", "Created date", ""];
        for (let i = 0; i < heads.length; i++) {
            const c = cell("cn_h" + i, heads[i], { fontWeight: 600 });
            headRow.elements[c.id] = c;
        }
        const thead = { id: "cn_th", jsontype: "mui.tablehead", elements: { [headRow.id]: headRow } };
        const bodyEls = {};
        for (let i = 0; i < rows.size(); i++) {
            const r = rows.get(i);
            const row = { id: "cn_r" + i, jsontype: "mui.tablerow", elements: {} };
            const c0 = cell("cn_r" + i + "_0", String(r.get("customerName")));
            const c1 = cell("cn_r" + i + "_1", String(r.get("noteText")));
            const c2 = cell("cn_r" + i + "_2", String(r.get("createdDate")));
            const c3 = { id: "cn_r" + i + "_3", jsontype: "mui.tablecell", elements: {} };
            const b1 = btn("cn_r" + i + "_open", "Open");
            const b2 = btn("cn_r" + i + "_del", "Delete");
            c3.elements[b1.id] = b1;
            c3.elements[b2.id] = b2;
            row.elements[c0.id] = c0; row.elements[c1.id] = c1; row.elements[c2.id] = c2; row.elements[c3.id] = c3;
            bodyEls[row.id] = row;
        }
        const tbody = { id: "cn_tb", jsontype: "mui.tablebody", elements: bodyEls };
        const table = { id: "cn_t", jsontype: "mui.table", props: { size: "small" }, elements: { [thead.id]: thead, [tbody.id]: tbody } };
        const tc = { id: "cn_tc", jsontype: "mui.tablecontainer", elements: { [table.id]: table } };
        const tableRegion = { id: "cn_table_region", jsontype: "mui.box", props: { sx: { flex: 2, overflowY: "auto", minWidth: 0 } },
            elements: { [tc.id]: tc } };

        const nameEl = viewUtils.buildUIElement(model.fieldNameToModelId("customerName"));
        const textEl = viewUtils.buildUIElement(model.fieldNameToModelId("noteText"));
        const dateEl = viewUtils.buildUIElement(model.fieldNameToModelId("createdDate"));
        const title = { id: "cn_pt", jsontype: "mui.typography", props: { variant: "subtitle2", children: "Selected note", sx: { mb: 1 } } };
        const sBtn = btn("cn_save", "Save");
        const cBtn = btn("cn_cancel", "Cancel");
        const actions = { id: "cn_pa", jsontype: "mui.stack", props: { direction: "row", spacing: 1, sx: { mt: 1 } },
            elements: { [sBtn.id]: sBtn, [cBtn.id]: cBtn } };
        const panelEls = {};
        panelEls[title.id] = title;
        panelEls[nameEl.id] = nameEl; panelEls[textEl.id] = textEl; panelEls[dateEl.id] = dateEl;
        panelEls[actions.id] = actions;
        const panel = { id: "cn_panel", jsontype: "mui.paper", props: { variant: "outlined", sx: { flex: 1, p: 2, overflowY: "auto", minWidth: 0 } },
            elements: panelEls };

        const split = { id: "cn_split", jsontype: "mui.box", props: { sx: { display: "flex", flexDirection: "row", gap: 2, flex: 1, minHeight: 0 } },
            elements: { [tableRegion.id]: tableRegion, [panel.id]: panel } };
        return { sx: { height: "100%", overflow: "hidden" }, elements: {
            [root]: { id: root, jsontype: "mui.box", props: { sx: { height: "100%", width: "100%", display: "flex", flexDirection: "column", p: 2 } },
                elements: { [split.id]: split } } } };
    } };
})();