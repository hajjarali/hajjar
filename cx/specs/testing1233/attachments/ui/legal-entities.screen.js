// screen mock: Legal entities | root: cdm.base.staticdata.party.LegalEntity
// Legal entities — screen mock. One container per region of the block, in order:
// filter bar (name, status, entityIdentifier; search), table (one row per LegalEntity; new, open, delete),
// side panel (the selected row's default form; save, cancel). Buttons do nothing in a mock.
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    // Every helper result is captured in a variable first and keyed by its own .id.
    function typo(id, variant, children, sx) {
        const props = { variant: variant, children: children };
        if (sx) { props.sx = sx; }
        return { id: id, jsontype: "mui.typography", props: props };
    }
    function box(id, sx, children) {
        const els = {};
        for (let i = 0; i < children.length; i++) { els[children[i].id] = children[i]; }
        return { id: id, jsontype: "mui.box", props: { sx: sx }, elements: els };
    }
    function icon(id, name) {
        return { id: id, jsontype: "mui.icon", props: { children: name, fontSize: "small" } };
    }
    function button(id, label, variant, startIcon) {
        const props = { size: "small", variant: variant, children: label };
        if (startIcon) { props.startIcon = startIcon; }
        return { id: id, jsontype: "mui.button", props: props };
    }
    function iconBtn(id, name, title) {
        const ic = icon(id + "_i", name);
        return { id: id, jsontype: "mui.iconbutton", props: { size: "small", title: title }, elements: { [ic.id]: ic } };
    }
    function softChip(id, label, color) {
        return { id: id, jsontype: "ui.display.chip", props: { label: label, size: "small", variant: "soft", color: color } };
    }
    function statusColor(status) {
        if (status === "active") { return "success"; }
        if (status === "retired") { return "neutral"; }
        return "warning";
    }
    function textField(id, label) {
        return { id: id, jsontype: "mui.textfield", props: { label: label, size: "small", variant: "outlined", sx: { minWidth: 200 } } };
    }
    function cell(id, text, sx) {
        const props = { children: text };
        if (sx) { props.sx = sx; }
        return { id: id, jsontype: "mui.tablecell", props: props };
    }

    // Region 1 — filter bar: name, status, entityIdentifier; search.
    function filterBar(root) {
        const id = root + "_filter";
        const nameF = textField(id + "_name", "Name");
        const statusF = { id: id + "_status", jsontype: "mui.select", value: "",
            props: { label: "Status", size: "small", sx: { minWidth: 140 }, items: [
                { jsontype: "mui.menuitem", props: { value: "draft", children: "draft" } },
                { jsontype: "mui.menuitem", props: { value: "active", children: "active" } },
                { jsontype: "mui.menuitem", props: { value: "retired", children: "retired" } } ] } };
        const identF = textField(id + "_ident", "Identifier");
        const search = button(id + "_search", "Search", "contained", "search");
        return box(id, { display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 },
            [nameF, statusF, identF, search]);
    }

    // Region 2 — table: one row per LegalEntity, name first; new, open, delete.
    function tableRegion(root) {
        const id = root + "_table";
        const title = typo(id + "_title", "overline", "Legal entities  (" + rows.size() + ")", { fontWeight: 650 });
        const newBtn = button(id + "_new", "New legal entity", "text", "add");
        const head = box(id + "_head", { display: "flex", alignItems: "center", justifyContent: "space-between", px: 1.5, py: 1, flexShrink: 0 }, [title, newBtn]);

        const heads = ["Name", "Status", "Identifiers", ""];
        const headCells = {};
        for (let h = 0; h < heads.length; h++) {
            const hc = { id: id + "_h" + h, jsontype: "mui.tablecell", props: { children: heads[h], align: h === 3 ? "right" : "left" } };
            headCells[hc.id] = hc;
        }
        const headRow = { id: id + "_hr", jsontype: "mui.tablerow", elements: headCells };
        const tableHead = { id: id + "_th", jsontype: "mui.tablehead", elements: { [headRow.id]: headRow } };

        const body = {};
        for (let i = 0; i < rows.size(); i++) {
            const r = rows.get(i);
            const rid = id + "_r" + i;
            const status = String(r.get("status") || "");
            const cName = cell(rid + "_n", String(r.get("name") || ""), { fontWeight: 600 });
            const chip = softChip(rid + "_sc", status, statusColor(status));
            const cStatus = { id: rid + "_s", jsontype: "mui.tablecell", elements: { [chip.id]: chip } };
            const cIdent = cell(rid + "_i", String(r.get("entityIdentifier") || ""), { fontFamily: "monospace" });
            const openB = iconBtn(rid + "_open", "edit", "Open");
            const delB = iconBtn(rid + "_del", "delete", "Delete");
            const acts = box(rid + "_ab", { display: "flex", justifyContent: "flex-end" }, [openB, delB]);
            const cActs = { id: rid + "_a", jsontype: "mui.tablecell", props: { align: "right", sx: { width: 96 } }, elements: { [acts.id]: acts } };
            const rowSx = i === 0 ? { bgcolor: "action.selected" } : {};
            const row = { id: rid, jsontype: "mui.tablerow", props: { hover: true, sx: rowSx },
                elements: { [cName.id]: cName, [cStatus.id]: cStatus, [cIdent.id]: cIdent, [cActs.id]: cActs } };
            body[row.id] = row;
        }
        const tableBody = { id: id + "_tb", jsontype: "mui.tablebody", elements: body };
        const table = { id: id + "_tbl", jsontype: "mui.table", props: { size: "small", stickyHeader: true },
            elements: { [tableHead.id]: tableHead, [tableBody.id]: tableBody } };
        const container = { id: id + "_tc", jsontype: "mui.tablecontainer", props: { sx: { flex: 1, minHeight: 0, overflow: "auto" } },
            elements: { [table.id]: table } };
        return box(id, { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", minHeight: 0 }, [head, container]);
    }

    // Region 3 — side panel: the selected row's default form; save, cancel.
    function sidePanel(root) {
        const id = root + "_panel";
        const title = typo(id + "_title", "overline", "Selected legal entity", { fontWeight: 650 });
        const nameEl = viewUtils.buildUIElement(model.fieldNameToModelId("name"));
        const statusEl = viewUtils.buildUIElement(model.fieldNameToModelId("status"));
        const note = typo(id + "_note", "body2", "Identifiers: table with Add identifier, as on the default form.",
            { color: "text.secondary", textTransform: "none" });
        const fields = box(id + "_fields", { display: "flex", flexDirection: "column", gap: 2, p: 1.5, flex: 1, minHeight: 0, overflow: "auto" },
            [nameEl, statusEl, note]);
        const save = button(id + "_save", "Save", "contained", null);
        const cancel = button(id + "_cancel", "Cancel", "text", null);
        const footer = box(id + "_footer", { display: "flex", justifyContent: "flex-end", gap: 1, p: 1.5, borderTop: "1px solid", borderColor: "divider", flexShrink: 0 },
            [cancel, save]);
        const titleBox = box(id + "_th", { px: 1.5, py: 1, flexShrink: 0 }, [title]);
        return box(id, { width: 360, flexShrink: 0, display: "flex", flexDirection: "column", minHeight: 0, borderLeft: "1px solid", borderColor: "divider" },
            [titleBox, fields, footer]);
    }

    return {
        main: function () {
            const root = model.getId() + "_root";
            const filter = filterBar(root);
            const table = tableRegion(root);
            const panel = sidePanel(root);
            const main = box(root + "_main", { display: "flex", flex: 1, minHeight: 0 }, [table, panel]);
            const screen = box(root, { display: "flex", flexDirection: "column", height: "100%", width: "100%", minHeight: 0 }, [filter, main]);
            return {
                sx: { height: "100%", overflow: "hidden" },
                elements: { [screen.id]: screen }
            };
        }
    };
})();
