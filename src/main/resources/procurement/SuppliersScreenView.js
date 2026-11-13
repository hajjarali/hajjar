// Suppliers screen — the spec's mock (ui/suppliers.screen.js) region for region: a name-sorted table (inactive rows
// greyed out from `active`, never filtered) with add / open, beside a side panel with the supplier's form,
// save and cancel. Rows arrive live, so the model calls redraw() when the rows, the selection or the mode change.
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    function els(list) {
        const out = {};
        for (let i = 0; i < list.length; i++) { out[list[i].id] = list[i]; }
        return out;
    }
    function cell(id, text, grey) {
        return { id: id, jsontype: "mui.tablecell", props: { children: text, sx: grey ? { color: "text.disabled" } : {} } };
    }
    return { main: function () {
        const root = model.getId() + "_root";
        const rows = model.getRowsValue();
        const selectedKey = model.getSelectedKeyValue();
        const selectId = model.fieldNameToModelId("selectConduit");

        const body = [];
        for (let i = 0; i < rows.size(); i++) {
            const r = rows.get(i);
            const rid = root + "_row_" + i;
            const grey = !r.getActive();
            const selected = r.getKey() === selectedKey;
            body.push({ id: rid, jsontype: "mui.tablerow",
                props: { hover: true, selected: selected, sx: { cursor: "pointer" } },
                actions: viewUtils.actions(viewUtils.onClick([viewUtils.triggerChange(selectId, r.getKey())])),
                elements: els([
                    cell(rid + "_n", r.getName(), grey),
                    cell(rid + "_e", r.getContactEmail(), grey),
                    cell(rid + "_c", r.getCountry(), grey),
                    cell(rid + "_a", r.getActive() ? "Yes" : "No", grey)
                ]) });
        }
        const labels = ["Name", "Contact email", "Country", "Active"];
        const heads = [];
        for (let j = 0; j < labels.length; j++) {
            heads.push({ id: root + "_h_" + j, jsontype: "mui.tablecell", props: { children: labels[j], sx: { fontWeight: 600 } } });
        }
        const head = { id: root + "_thead", jsontype: "mui.tablehead", elements: els([
            { id: root + "_hrow", jsontype: "mui.tablerow", elements: els(heads) }]) };
        const tbody = { id: root + "_tbody", jsontype: "mui.tablebody", elements: els(body) };
        const table = { id: root + "_table", jsontype: "mui.table", props: { size: "small", stickyHeader: true },
            elements: els([head, tbody]) };
        const tableContainer = { id: root + "_tc", jsontype: "mui.tablecontainer", props: { sx: { flex: 1, overflowY: "auto" } },
            elements: els([table]) };
        const empty = { id: root + "_empty", jsontype: "mui.typography",
            props: { variant: "body2", children: "No suppliers yet. Add one to get started.",
                sx: { color: "text.disabled", fontStyle: "italic", p: 2 } } };

        const addBtn = viewUtils.buildUIElement(model.fieldNameToModelId("addButton"));
        const openBtn = viewUtils.buildUIElement(model.fieldNameToModelId("openButton"));
        const toolbar = { id: root + "_tbar", jsontype: "mui.box", props: { sx: { display: "flex", gap: 1, p: 1 } },
            elements: els([addBtn, openBtn]) };
        const tableParts = [toolbar, tableContainer];
        if (rows.size() === 0) { tableParts.push(empty); }
        const tableRegion = { id: root + "_region_table", jsontype: "mui.box",
            props: { sx: { flex: 2, display: "flex", flexDirection: "column", minWidth: 0, height: "100%" } },
            elements: els(tableParts) };

        const nameField = viewUtils.buildUIElement(model.fieldNameToModelId("name"));
        const emailField = viewUtils.buildUIElement(model.fieldNameToModelId("contactEmail"));
        const countryField = viewUtils.buildUIElement(model.fieldNameToModelId("country"));
        const activeField = viewUtils.buildUIElement(model.fieldNameToModelId("active"));
        const saveBtn = viewUtils.buildUIElement(model.fieldNameToModelId("saveButton"));
        const cancelBtn = viewUtils.buildUIElement(model.fieldNameToModelId("cancelButton"));
        const conduit = viewUtils.buildUIElement(selectId);
        const panel = { id: root + "_region_panel", jsontype: "mui.box",
            props: { sx: { flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 2, p: 2,
                borderLeft: "1px solid", borderColor: "divider", overflowY: "auto" } },
            elements: els([
                { id: root + "_ptitle", jsontype: "mui.typography",
                    props: { variant: "subtitle1", children: model.getPanelTitleValue(), sx: { fontWeight: 600 } } },
                nameField, emailField, countryField, activeField,
                { id: root + "_pbtns", jsontype: "mui.box", props: { sx: { display: "flex", gap: 1 } },
                    elements: els([saveBtn, cancelBtn]) },
                { id: root + "_conduit", jsontype: "mui.box", props: { sx: { display: "none" } }, elements: els([conduit]) }
            ]) };

        const rootBox = { id: root, jsontype: "mui.box",
            props: { sx: { display: "flex", height: "100%", width: "100%", overflow: "hidden" } },
            elements: els([tableRegion, panel]) };
        return { sx: { height: "100%", overflow: "hidden" }, elements: els([rootBox]) };
    } };
})();
