(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label, helper) {
        const props = { label: label, variant: "outlined" };
        if (helper) { props.helperText = helper; }
        const el = viewUtils.buildUIElement(id, props);
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    function section(sectionId, accent, title, items) {
        const grid = sectionId + "_g";
        const children = {};
        for (const it of items) { children[it.id] = it; }
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: {
            [sectionId + "_t"]: { id: sectionId + "_t", jsontype: "mui.stack",
                props: { direction: "row", spacing: 1, sx: { alignItems: "center", mb: 1 } },
                elements: {
                    [sectionId + "_dot"]: { id: sectionId + "_dot", jsontype: "ui.badges.pulseDot",
                        props: { color: accent, size: 10, pulse: false } },
                    [sectionId + "_label"]: { id: sectionId + "_label", jsontype: "mui.typography",
                        props: { variant: "subtitle2", children: title,
                            sx: { textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: accent, letterSpacing: 1 } } }
                } },
            [grid]: { id: grid, jsontype: "mui.box",
                props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 } },
                elements: { [grid + "_in"]: { id: grid + "_in", jsontype: "mui.grid",
                    props: { container: true, columns: 12, spacing: 2 }, elements: children } } }
        } };
    }

    // Single-Ref card for the required School reference (platform single-ref recipe):
    // the hidden ref mount carries the search/view/clear conduits; the visible card
    // shows the target descriptor's label (getEntityLabelValue) as the primary text
    // with the row id beneath, a read-only view button (always built, never
    // readOnly-gated), a search button built only while isPickEnabled(), and a clear
    // button built only while isClearEnabled() — school is required, so no clear.
    function schoolRefCard(cardId, size, refField) {
        const ro = readOnly.boolValue();
        const hasValue = refField.getRefIdValue() !== null;
        const mount = viewUtils.buildUIElement(model.fieldNameToModelId("school"));
        const primary = hasValue ? (refField.getEntityLabelValue() || "School") : "No school selected";
        const els = {};

        els[cardId + "_cap"] = { id: cardId + "_cap", jsontype: "mui.typography",
            props: { variant: "caption", children: "School", sx: { textTransform: "none", color: "text.secondary", display: "block", mb: 0.5 } } };

        els[cardId + "_text"] = { id: cardId + "_text", jsontype: "mui.box",
            props: { sx: { flex: 1, minWidth: 0 } },
            elements: {
                [cardId + "_label"]: { id: cardId + "_label", jsontype: "mui.typography",
                    props: { variant: "subtitle1", children: primary, sx: { fontWeight: 500 } } },
                [cardId + "_sub"]: { id: cardId + "_sub", jsontype: "mui.typography",
                    props: { variant: "caption",
                        children: hasValue ? ("School #" + refField.getRefIdValue()) : "Pick a school to enrol this student",
                        sx: { color: "text.secondary" } } }
            } };

        // view — always built; read-only conduit, never readOnly-gated; disabled only when empty
        els[cardId + "_viewBtn"] = { id: cardId + "_viewBtn", jsontype: "mui.iconbutton",
            props: { size: "small", disabled: !hasValue },
            elements: { [cardId + "_viewIcon"]: { id: cardId + "_viewIcon", jsontype: "mui.icon", props: { children: "visibility" } } },
            actions: viewUtils.actions(viewUtils.onClick([ viewUtils.click(refField.fieldNameToModelId("viewButton")) ])) };

        // search / re-pick — built only while the field is pickable
        if (refField.isPickEnabled()) {
            els[cardId + "_searchBtn"] = { id: cardId + "_searchBtn", jsontype: "mui.iconbutton",
                props: { size: "small", disabled: ro },
                elements: { [cardId + "_searchIcon"]: { id: cardId + "_searchIcon", jsontype: "mui.icon", props: { children: "search" } } },
                actions: viewUtils.actions(viewUtils.onClick([ viewUtils.click(refField.fieldNameToModelId("searchButton")) ])) };
        }

        // clear — built only when clearable (editable + nullable); school is required, so hidden
        if (refField.isClearEnabled()) {
            els[cardId + "_clearBtn"] = { id: cardId + "_clearBtn", jsontype: "mui.iconbutton",
                props: { size: "small", disabled: ro },
                elements: { [cardId + "_clearIcon"]: { id: cardId + "_clearIcon", jsontype: "mui.icon", props: { children: "close" } } },
                actions: viewUtils.actions(viewUtils.onClick([ viewUtils.click(refField.fieldNameToModelId("clearButton")) ])) };
        }

        // Mandatory mount — placed inline; the framework hides its internals.
        els[mount.id] = mount;

        const card = { id: cardId, jsontype: "mui.box",
            props: { sx: { display: "flex", alignItems: "center", gap: 1, border: "1px solid", borderColor: "divider", borderRadius: 2, p: 1.5, bgcolor: "background.paper" } },
            elements: els };
        return { id: cardId + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [card.id]: card } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = function (n) { return model.fieldNameToModelId(n); };

        const headerId = root + "_header";
        const avatarId = headerId + "_av";
        const titleId = headerId + "_t";
        const subId = headerId + "_s";
        const chipId = headerId + "_chip";
        const header = { id: headerId, jsontype: "mui.stack",
            props: { direction: "row", spacing: 2, sx: { alignItems: "center", mb: 3 } },
            elements: {
                [avatarId]: { id: avatarId, jsontype: "ui.display.avatar",
                    props: { value: "Student", icon: "face", color: "secondary", gradient: true, size: 48, variant: "rounded" } },
                [titleId]: { id: titleId, jsontype: "mui.box", props: { sx: { flex: 1 } }, elements: {
                    [titleId + "_t"]: { id: titleId + "_t", jsontype: "mui.typography",
                        props: { variant: "h5", children: "Student" } },
                    [subId]: { id: subId, jsontype: "mui.typography",
                        props: { variant: "body2", children: "Enrolment details", sx: { color: "text.secondary" } } }
                } },
                [chipId]: { id: chipId, jsontype: "ui.display.chip",
                    props: { label: "Enrolment", color: "secondary", variant: "soft", icon: "menuBook" } }
            } };

        const personal = section(root + "_personal", "primary", "Personal", [
            gridField(fid("name"), 6, "Name"),
            gridField(fid("age"), 6, "Age", "In years")
        ]);

        const enrolment = section(root + "_enrolment", "secondary", "Enrolment", [
            gridField(fid("className"), 6, "Class", "e.g. 7B"),
            schoolRefCard(root + "_school", 6, school)
        ]);

        return { sx: { p: 2, maxWidth: 720, mx: "auto", minWidth: 320 },
            elements: { [header.id]: header, [personal.id]: personal, [enrolment.id]: enrolment } };
    } };
})();