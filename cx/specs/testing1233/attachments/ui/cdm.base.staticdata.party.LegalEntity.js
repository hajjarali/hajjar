// LegalEntity — default form with an identity header (rules D1, D4, D5, D9, D11, D12, D14, D15, D17).
// The header names the entity (monogram, name, first identifier as a mono fact, status as a soft chip, History / Audit
// links). Details holds the name and the status; the identifiers are a table whose rows open the EntityIdentifier
// form in a dialog. The Save / Close footer is the hosting form pane's own row (D15), not drawn by this file.
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    const beanViewUtils = require("cyai/beans/view/BeanViewUtils");

    // Every helper result is captured in a variable first and keyed by its own .id.
    function typo(id, variant, children, sx) {
        const props = { variant: variant, children: children };
        if (sx) { props.sx = sx; }
        return { id: id, jsontype: "mui.typography", props: props };
    }
    function icon(id, name) {
        return { id: id, jsontype: "mui.icon", props: { children: name, fontSize: "small" } };
    }
    function box(id, sx, children) {
        const els = {};
        for (let i = 0; i < children.length; i++) { els[children[i].id] = children[i]; }
        return { id: id, jsontype: "mui.box", props: { sx: sx }, elements: els };
    }
    // `disabled` is dynamic state, so it sits at the top level of the node, not in props.
    function iconBtn(id, name, title, disabled, actions) {
        const ic = icon(id + "_i", name);
        return { id: id, jsontype: "mui.iconbutton", disabled: disabled, props: { size: "small", title: title },
            elements: { [ic.id]: ic }, actions: actions };
    }
    function click(targetId) { return viewUtils.actions(viewUtils.onClick([viewUtils.click(targetId)])); }
    function softChip(id, label, color) {
        return { id: id, jsontype: "ui.display.chip", props: { label: label, size: "small", variant: "soft", color: color || "primary" } };
    }
    function initialsOf(name) {
        const words = String(name || "").split(" ").filter(function (w) { return w && /^[A-Za-z]/.test(w); });
        const first = words.length ? words[0].charAt(0) : "?";
        const second = words.length > 1 ? words[1].charAt(0) : "";
        return (first + second).toUpperCase();
    }
    function statusColor(status) {
        if (status === "active") { return "success"; }
        if (status === "retired") { return "neutral"; }
        return "warning";
    }

    // D3 + D12 + D15 — an overline title (with an optional count and action) over one outlined box.
    function section(id, title, count, action, bodyChildren) {
        const t = typo(id + "_t", "overline", title + (count !== null ? "  (" + count + ")" : ""), { fontWeight: 650 });
        const headChildren = [t];
        if (action) { headChildren.push(action); }
        const head = box(id + "_h", { display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }, headChildren);
        const body = box(id + "_b", { border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }, bodyChildren);
        return box(id, { mt: 2 }, [head, body]);
    }

    // D1 + D14 — monogram, the name as the title, the first identifier as a mono fact; the status as a chip and the
    // history links on the right.
    function header(rootId, name, status, count) {
        const id = rootId + "_head";
        const av = { id: id + "_av", jsontype: "mui.avatar", props: { variant: "rounded", children: initialsOf(name),
            sx: { width: 48, height: 48, borderRadius: 2, bgcolor: "primary.main", color: "common.white", fontWeight: 700, fontSize: 18 } } };
        const title = typo(id + "_t", "h5", name || "New legal entity", { fontWeight: 700, lineHeight: 1.2 });
        let fact;
        if (count > 0) {
            const first = entityIdentifier.getEntriesValue().get(0).getBean();
            const ft = typo(id + "_ft", "caption", String(first.getIdentifierType() || "ID"),
                { color: "text.secondary", fontWeight: 650, textTransform: "none" });
            const fv = typo(id + "_fv", "body2", String(first.getIdentifier() || ""), { fontFamily: "monospace", color: "text.primary" });
            fact = box(id + "_fact", { display: "flex", alignItems: "center", gap: 0.75, mt: 0.25 }, [ft, fv]);
        } else {
            fact = typo(id + "_fact", "body2", "No identifier yet", { color: "text.disabled", fontStyle: "italic" });
        }
        const txt = box(id + "_txt", { minWidth: 0, flex: 1 }, [title, fact]);
        const chipList = [];
        if (status) { chipList.push(softChip(id + "_st", String(status), statusColor(String(status)))); }
        const chips = box(id + "_chips", { display: "flex", gap: 0.5 }, chipList);
        const hist = typo(id + "_hist", "caption", "History", { color: "primary.main", cursor: "pointer", textTransform: "none" });
        const aud = typo(id + "_aud", "caption", "Audit", { color: "primary.main", cursor: "pointer", textTransform: "none" });
        const links = box(id + "_links", { display: "flex", gap: 1.5 }, [hist, aud]);
        const side = box(id + "_side", { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.75 }, [chips, links]);
        return box(id, { display: "flex", alignItems: "center", gap: 1.75, pb: 1.75, mb: 2, borderBottom: "1px solid", borderColor: "divider" }, [av, txt, side]);
    }

    // D5 — the name is a short text (8 of 12 columns), the status an enum (4 of 12); required fields first (D4).
    function details(rootId) {
        const id = rootId + "_det";
        const nameEl = viewUtils.buildUIElement(model.fieldNameToModelId("name"));
        const statusEl = viewUtils.buildUIElement(model.fieldNameToModelId("status"));
        const gn = { id: id + "_gn", jsontype: "mui.grid", props: { size: 8 }, elements: { [nameEl.id]: nameEl } };
        const gs = { id: id + "_gs", jsontype: "mui.grid", props: { size: 4 }, elements: { [statusEl.id]: statusEl } };
        const grid = { id: id + "_g", jsontype: "mui.grid", props: { container: true, columns: 12, spacing: 2, sx: { p: 2 } },
            elements: { [gn.id]: gn, [gs.id]: gs } };
        return section(id, "Details", null, null, [grid]);
    }

    // D9 + D17 — one row per identifier; the row opens the EntityIdentifier form in a dialog.
    function identifierRow(entry, i, tableId, ro, canEdit) {
        const rowId = tableId + "_r" + i, dlgId = rowId + "_dlg";
        const ident = entry.getBean();
        const actionList = [];
        const openBtn = iconBtn(rowId + "_open", "edit", ro ? "Open the identifier" : "Edit the identifier", false,
            viewUtils.actions(viewUtils.onClick([viewUtils.open(dlgId)])));
        actionList.push(openBtn);
        const extras = [];
        if (canEdit) {
            const rmBtn = iconBtn(rowId + "_rm", "delete", ro ? "Read only — edit the entity to remove an identifier" : "Remove the identifier", ro,
                click(entry.fieldNameToModelId("removeButton")));
            actionList.push(rmBtn);
            const rmMount = viewUtils.buildNestedUIElement(entry.fieldNameToModelId("removeButton"));
            extras.push(rmMount);
        }
        const form = viewUtils.buildNestedUIElement(entry.getInnerFormId());
        const dlgContent = { id: dlgId + "_c", jsontype: "mui.dialogcontent", elements: { [form.id]: form } };
        const dlg = { id: dlgId, jsontype: "mui.dialog", open: false, props: { keepMounted: true, fullWidth: true, maxWidth: "sm" },
            elements: { [dlgContent.id]: dlgContent },
            actions: viewUtils.actions(viewUtils.onClose([viewUtils.updateProperty(dlgId, "open", false)])) };
        extras.push(dlg);
        const type = ident.getIdentifierType();
        const cellV = { id: rowId + "_v", jsontype: "mui.tablecell",
            props: { children: String(ident.getIdentifier() || ""), sx: { fontFamily: "monospace", fontWeight: 600 } } };
        let kindChild;
        if (type) { kindChild = softChip(rowId + "_kc", String(type), "info"); }
        else { kindChild = typo(rowId + "_kn", "body2", "Not set", { color: "text.disabled" }); }
        const cellK = { id: rowId + "_k", jsontype: "mui.tablecell", elements: { [kindChild.id]: kindChild } };
        const actionBox = box(rowId + "_ab", { display: "flex", justifyContent: "flex-end" }, actionList);
        const cellA = { id: rowId + "_a", jsontype: "mui.tablecell", props: { align: "right", sx: { width: 96 } },
            elements: { [actionBox.id]: actionBox } };
        const row = { id: rowId, jsontype: "mui.tablerow", props: { hover: true },
            elements: { [cellV.id]: cellV, [cellK.id]: cellK, [cellA.id]: cellA } };
        return { row: row, extras: extras };
    }

    function identifiersTable(rootId, count, ro) {
        const tableId = model.fieldNameToModelId("entityIdentifier") + "_table";
        const canEdit = entityIdentifier.isMutable();
        const headCells = {};
        const heads = ["Identifier", "Type", ""];
        for (let h = 0; h < heads.length; h++) {
            const hc = { id: tableId + "_h" + h, jsontype: "mui.tablecell", props: { children: heads[h], align: h === 2 ? "right" : "left" } };
            headCells[hc.id] = hc;
        }
        const headRow = { id: tableId + "_hr", jsontype: "mui.tablerow", elements: headCells };
        const tableHead = { id: tableId + "_th", jsontype: "mui.tablehead", elements: { [headRow.id]: headRow } };
        const body = {};
        const extras = [];
        const entries = entityIdentifier.getEntriesValue();
        for (let i = 0; i < count; i++) {
            const r = identifierRow(entries.get(i), i, tableId, ro, canEdit);
            body[r.row.id] = r.row;
            for (let e = 0; e < r.extras.length; e++) { extras.push(r.extras[e]); }
        }
        const tableBody = { id: tableId + "_tb", jsontype: "mui.tablebody", elements: body };
        const table = { id: tableId + "_tbl", jsontype: "mui.table", props: { size: "small" },
            elements: { [tableHead.id]: tableHead, [tableBody.id]: tableBody } };
        const bodyChildren = [table];
        if (count === 0) {
            bodyChildren.push(typo(tableId + "_empty", "body2", "No identifiers yet. Add the entity's LEI first.",
                { color: "text.disabled", fontStyle: "italic", textAlign: "center", py: 2 }));
        }
        for (let e = 0; e < extras.length; e++) { bodyChildren.push(extras[e]); }
        let add = null;
        if (canEdit) {
            const addMount = viewUtils.buildNestedUIElement(entityIdentifier.fieldNameToModelId("addButton"));
            bodyChildren.push(addMount);
            add = { id: tableId + "_add", jsontype: "mui.button", disabled: ro,
                props: { size: "small", variant: "text", startIcon: "add", children: "Add identifier",
                    title: ro ? "Read only — edit the entity to add an identifier" : "Add an identifier" },
                actions: click(entityIdentifier.fieldNameToModelId("addButton")) };
        }
        return section(tableId, "Identifiers", count, add, bodyChildren);
    }

    return {
        main: function () {
            const rootId = model.getId() + "_root";
            const ro = readOnly.boolValue();
            const count = entityIdentifier.getSizeValue();
            const head = header(rootId, model.getFieldValue("name"), model.getFieldValue("status"), count);
            const det = details(rootId);
            const table = identifiersTable(rootId, count, ro);
            const idv = beanViewUtils.buildIdView(model.getId());
            return {
                sx: { p: 2, maxWidth: 960, minWidth: 360, mx: "auto" },
                elements: {
                    [idv.idRow.id]: idv.idRow,
                    [head.id]: head,
                    [det.id]: det,
                    [table.id]: table
                }
            };
        }
    };
})();
