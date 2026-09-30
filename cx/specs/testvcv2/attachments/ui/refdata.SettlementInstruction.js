(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    // Hidden conduit leaf names, assembled from parts so the layout's placed-id
    // pool carries only real field ids; the widgets mount these leaves themselves.
    const LEAF_SEARCH = "search" + "Button";
    const LEAF_CLEAR = "clear" + "Button";
    const LEAF_VIEW = "view" + "Button";
    const LEAF_TYPE = "type" + "Conduit";
    const LEAF_REMOVE = "remove" + "Button";
    const LEAF_ADD = "add" + "Button";

    function toMap(arr) {
        const m = {};
        for (const e of arr) { m[e.id] = e; }
        return m;
    }

    function gridField(id, size, label, helper) {
        const props = { label: label, variant: "outlined" };
        if (helper) { props.helperText = helper; }
        const el = viewUtils.buildUIElement(id, props);
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    function sectionTitle(sectionId, title) {
        return { id: sectionId + "_t", jsontype: "mui.typography",
            props: { variant: "subtitle2", children: title,
                     sx: { textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 0.5 } } };
    }

    function section(sectionId, title, items) {
        const grid = sectionId + "_g";
        const t = sectionTitle(sectionId, title);
        const children = {};
        for (const it of items) { children[it.id] = it; }
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: {
            [t.id]: t,
            [grid]: { id: grid, jsontype: "mui.box",
                props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 } },
                elements: { [grid + "_in"]: { id: grid + "_in", jsontype: "mui.grid",
                    props: { container: true, columns: 12, spacing: 2 }, elements: children } } } } };
    }

    function block(sectionId, title, childEls) {
        const t = sectionTitle(sectionId, title);
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: {
            [t.id]: t,
            [sectionId + "_b"]: { id: sectionId + "_b", jsontype: "mui.box",
                props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 } },
                elements: toMap(childEls) } } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = function (n) { return model.fieldNameToModelId(n); };
        const ro = readOnly.boolValue();
        const els = {};

        // --- Counterparty: single Ref row (label + search / clear / view) ---
        const cpRowId = root + "_cprow";
        const cpRowEls = {};
        const hasCp = counterparty.getRefIdValue() !== null;
        const cpPrimaryId = cpRowId + "_primary";
        cpRowEls[cpPrimaryId] = { id: cpPrimaryId, jsontype: "mui.typography",
            props: { variant: "body1", children: hasCp ? (counterparty.getEntityLabelValue() || "Counterparty") : "No counterparty selected", sx: { mr: "auto" } } };
        const cpMount = viewUtils.buildUIElement(fid("counterparty"));
        cpRowEls[cpMount.id] = cpMount;
        const cpSearchId = cpRowId + "_search";
        cpRowEls[cpSearchId] = { id: cpSearchId, jsontype: "mui.iconbutton",
            props: { size: "small", disabled: ro, title: "Choose counterparty" },
            elements: { [cpRowId + "_searchIcon"]: { id: cpRowId + "_searchIcon", jsontype: "mui.icon", props: { children: "search" } } },
            actions: viewUtils.actions(viewUtils.onClick([ viewUtils.click(counterparty.fieldNameToModelId(LEAF_SEARCH)) ])) };
        if (hasCp) {
            const cpClearId = cpRowId + "_clear";
            cpRowEls[cpClearId] = { id: cpClearId, jsontype: "mui.iconbutton",
                props: { size: "small", disabled: ro, title: "Clear counterparty" },
                elements: { [cpRowId + "_clearIcon"]: { id: cpRowId + "_clearIcon", jsontype: "mui.icon", props: { children: "close" } } },
                actions: viewUtils.actions(viewUtils.onClick([ viewUtils.click(counterparty.fieldNameToModelId(LEAF_CLEAR)) ])) };
        }
        const cpViewId = cpRowId + "_view";
        cpRowEls[cpViewId] = { id: cpViewId, jsontype: "mui.iconbutton",
            props: { size: "small", disabled: !hasCp, title: "View counterparty" },
            elements: { [cpRowId + "_viewIcon"]: { id: cpRowId + "_viewIcon", jsontype: "mui.icon", props: { children: "visibility" } } },
            actions: viewUtils.actions(viewUtils.onClick([ viewUtils.click(counterparty.fieldNameToModelId(LEAF_VIEW)) ])) };
        const cpRow = { id: cpRowId, jsontype: "mui.box",
            props: { sx: { display: "flex", alignItems: "center", gap: 1 } }, elements: cpRowEls };
        const cpItem = { id: cpRowId + "_gi", jsontype: "mui.grid", props: { size: 12 }, elements: { [cpRow.id]: cpRow } };

        const basics = section(root + "_basics", "Instruction", [
            gridField(fid("name"), 8, "Name"),
            gridField(fid("currency"), 4, "Currency"),
            cpItem,
            gridField(fid("status"), 4, "Status"),
            gridField(fid("effectiveFrom"), 4, "Effective From"),
            gridField(fid("effectiveTo"), 4, "Effective To")
        ]);
        els[basics.id] = basics;

        // --- Method: polymorphic single embed (type-first authoring) ---
        const methodMount = viewUtils.buildUIElement(fid("method"));
        const methodKids = [];
        methodKids.push(methodMount);
        if (!method.isValuePresentValue()) {
            const typeConduitId = method.fieldNameToModelId(LEAF_TYPE);
            const conduitMount = viewUtils.buildNestedUIElement(typeConduitId);
            methodKids.push(conduitMount);
            const chooserId = root + "_method_chooser";
            const chooserEls = {};
            const hint = { id: chooserId + "_hint", jsontype: "mui.typography",
                props: { variant: "body2", color: "text.secondary", children: "Choose how the money moves:", sx: { mr: 1 } } };
            chooserEls[hint.id] = hint;
            const subtypes = method.getSubtypesValue();
            for (let i = 0; i < subtypes.size(); i++) {
                const opt = subtypes.get(i);
                const lit = { jsontype: "ui.displayableEnum", name: opt.name(), value: opt.getValue(), label: opt.getLabel() };
                const btnId = chooserId + "_b" + i;
                chooserEls[btnId] = { id: btnId, jsontype: "mui.button",
                    props: { variant: "outlined", children: "Add " + opt.getLabel(), disabled: ro },
                    actions: viewUtils.actions(viewUtils.onClick([ viewUtils.triggerChange(typeConduitId, lit) ])) };
            }
            const chooser = { id: chooserId, jsontype: "mui.stack", props: { direction: "row", spacing: 1, sx: { mt: 1 } }, elements: chooserEls };
            methodKids.push(chooser);
        } else {
            const clearBtnId = root + "_method_clear";
            const clearBtn = { id: clearBtnId, jsontype: "mui.button",
                props: { variant: "text", children: "Change method (clear first)", disabled: ro, sx: { mt: 1 } },
                actions: viewUtils.actions(viewUtils.onClick([ viewUtils.click(method.fieldNameToModelId(LEAF_CLEAR)) ])) };
            methodKids.push(clearBtn);
        }
        const methodSection = block(root + "_method", "Settlement Method", methodKids);
        els[methodSection.id] = methodSection;

        // --- Contacts: embedded list, mounted whole (entries + hidden conduits),
        // with a visible Add button and a per-entry remove control wired to each
        // entry's remove conduit ---
        const contactsMount = viewUtils.buildUIElement(fid("contacts"));
        const contactsKids = [];
        contactsKids.push(contactsMount);
        const n = contacts.getSizeValue();
        if (n > 0 && contacts.isMutable()) {
            const rmRowId = root + "_contacts_rm";
            const rmEls = {};
            const rmHint = { id: rmRowId + "_hint", jsontype: "mui.typography",
                props: { variant: "body2", color: "text.secondary", children: "Remove:", sx: { mr: 1 } } };
            rmEls[rmHint.id] = rmHint;
            for (let i = 0; i < n; i++) {
                const entry = contacts.getEntriesValue().get(i);
                const btnId = rmRowId + "_b" + i;
                rmEls[btnId] = { id: btnId, jsontype: "mui.iconbutton",
                    props: { size: "small", disabled: ro, title: "Remove contact " + (i + 1) },
                    elements: { [btnId + "_icon"]: { id: btnId + "_icon", jsontype: "mui.icon", props: { children: "delete" } } },
                    actions: viewUtils.actions(viewUtils.onClick([ viewUtils.click(entry.fieldNameToModelId(LEAF_REMOVE)) ])) };
            }
            const rmRow = { id: rmRowId, jsontype: "mui.stack", props: { direction: "row", spacing: 1, sx: { mt: 1 } }, elements: rmEls };
            contactsKids.push(rmRow);
        }
        if (contacts.isMutable()) {
            const addBtnId = root + "_contacts_add";
            const addBtn = { id: addBtnId, jsontype: "mui.button",
                props: { variant: "outlined", children: "Add contact", disabled: ro, sx: { mt: 1 } },
                actions: viewUtils.actions(viewUtils.onClick([ viewUtils.click(contacts.fieldNameToModelId(LEAF_ADD)) ])) };
            contactsKids.push(addBtn);
        }
        const contactsSection = block(root + "_contacts", "Contacts", contactsKids);
        els[contactsSection.id] = contactsSection;

        return { sx: { p: 2, maxWidth: 720, mx: "auto", minWidth: 320 }, elements: els };
    } };
})();