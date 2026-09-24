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
            gridField(fid("school"), 6, "School")
        ]);

        return { sx: { p: 2, maxWidth: 720, mx: "auto", minWidth: 320 },
            elements: { [header.id]: header, [personal.id]: personal, [enrolment.id]: enrolment } };
    } };
})();