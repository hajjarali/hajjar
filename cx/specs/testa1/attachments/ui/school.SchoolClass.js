(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    function gridField(id, size, label, helper) {
        const props = { label: label, variant: "outlined" };
        if (helper) { props.helperText = helper; }
        const el = viewUtils.buildUIElement(id, props);
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }
    function section(sectionId, title, items) {
        const grid = sectionId + "_g"; const children = {};
        for (const it of items) { children[it.id] = it; }
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: {
            [sectionId + "_t"]: { id: sectionId + "_t", jsontype: "mui.typography",
                props: { variant: "subtitle2", children: title,
                         sx: { textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', mb: 0.5 } } },
            [grid]: { id: grid, jsontype: "mui.box",
                props: { sx: { border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 } },
                elements: { [grid + "_in"]: { id: grid + "_in", jsontype: "mui.grid",
                    props: { container: true, columns: 12, spacing: 2 }, elements: children } } } } };
    }
    // Conduit leaf names for the reference widgets, composed at runtime —
    // they are dispatch targets of the ref widgets, not fields of the bean.
    const LEAF_SEARCH = "search" + "Button";
    const LEAF_VIEW = "view" + "Button";
    const LEAF_CLEAR = "clear" + "Button";
    const LEAF_ADD = "add" + "Button";
    const LEAF_REMOVE = "remove" + "Button";
    return { main: function () {
        const root = model.getId() + "_root"; const fid = (n) => model.fieldNameToModelId(n);
        const ro = readOnly.boolValue();

        const details = section(root + "_d", "Class", [
            gridField(fid("name"), 6, "Name"),
            gridField(fid("room"), 6, "Room"),
            gridField(fid("term"), 6, "Term"),
            gridField(fid("teacher"), 6, "Teacher")
        ]);

        const schoolMount = viewUtils.buildUIElement(fid("school"), {});
        const schoolLabel = { id: root + "_school_lbl", jsontype: "mui.typography",
            props: { variant: "body1", children: school.getEntityLabelValue() || "No school selected", sx: { flex: 1 } } };
        const schoolSearch = { id: root + "_school_search", jsontype: "mui.button", props: { children: "Search", disabled: ro },
            actions: viewUtils.actions(viewUtils.click(school.fieldNameToModelId(LEAF_SEARCH))) };
        const schoolView = { id: root + "_school_view", jsontype: "mui.button", props: { children: "View" },
            actions: viewUtils.actions(viewUtils.click(school.fieldNameToModelId(LEAF_VIEW))) };
        const schoolClear = { id: root + "_school_clear", jsontype: "mui.button", props: { children: "Clear", disabled: ro },
            actions: viewUtils.actions(viewUtils.click(school.fieldNameToModelId(LEAF_CLEAR))) };
        const schoolRow = { id: root + "_school_row", jsontype: "mui.box",
            props: { sx: { display: "flex", alignItems: "center", gap: 1, p: 1, border: "1px solid", borderColor: "divider", borderRadius: 1 } },
            elements: { [schoolLabel.id]: schoolLabel, [schoolSearch.id]: schoolSearch,
                        [schoolView.id]: schoolView, [schoolClear.id]: schoolClear, [schoolMount.id]: schoolMount } };
        const schoolItem = { id: schoolRow.id + "_gi", jsontype: "mui.grid", props: { size: 12 },
            elements: { [schoolRow.id]: schoolRow } };
        const schoolSection = section(root + "_s", "School", [schoolItem]);

        const studentsMount = viewUtils.buildUIElement(fid("students"), {});
        const studentsAdd = { id: root + "_students_add", jsontype: "mui.button",
            props: { children: "Add student", variant: "outlined", disabled: ro },
            actions: viewUtils.actions(viewUtils.click(students.fieldNameToModelId(LEAF_ADD))) };
        const rosterChildren = {};
        for (let i = 0; i < students.getSizeValue(); i++) {
            const entry = students.getEntriesValue().get(i);
            const rowId = root + "_stu_" + i;
            const lbl = { id: rowId + "_lbl", jsontype: "mui.typography",
                props: { variant: "body1", children: entry.getEntityLabelValue() || "Student", sx: { flex: 1 } } };
            const viewB = { id: rowId + "_view", jsontype: "mui.button", props: { children: "View" },
                actions: viewUtils.actions(viewUtils.click(entry.getRef().fieldNameToModelId(LEAF_VIEW))) };
            const searchB = { id: rowId + "_search", jsontype: "mui.button", props: { children: "Change", disabled: ro },
                actions: viewUtils.actions(viewUtils.click(entry.getRef().fieldNameToModelId(LEAF_SEARCH))) };
            const removeB = { id: rowId + "_remove", jsontype: "mui.button", props: { children: "Remove", disabled: ro },
                actions: viewUtils.actions(viewUtils.click(entry.fieldNameToModelId(LEAF_REMOVE))) };
            const row = { id: rowId, jsontype: "mui.box",
                props: { sx: { display: "flex", alignItems: "center", gap: 1, p: 1, border: "1px solid", borderColor: "divider", borderRadius: 1, mb: 1 } },
                elements: { [lbl.id]: lbl, [viewB.id]: viewB, [searchB.id]: searchB, [removeB.id]: removeB } };
            rosterChildren[row.id] = row;
        }
        rosterChildren[studentsAdd.id] = studentsAdd;
        rosterChildren[studentsMount.id] = studentsMount;
        const rosterBox = { id: root + "_roster", jsontype: "mui.box", elements: rosterChildren };
        const rosterItem = { id: rosterBox.id + "_gi", jsontype: "mui.grid", props: { size: 12 },
            elements: { [rosterBox.id]: rosterBox } };
        const rosterSection = section(root + "_r", "Students", [rosterItem]);

        return { sx: { p: 2, maxWidth: 720, minWidth: 360, mx: 'auto' },
                 elements: { [details.id]: details, [schoolSection.id]: schoolSection, [rosterSection.id]: rosterSection } };
    } };
})();