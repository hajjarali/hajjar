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
    return { main: function () {
        const root = model.getId() + "_root"; const fid = (n) => model.fieldNameToModelId(n);
        const identity = section(root + "_i", "Student", [
            gridField(fid("fullName"), 6, "Full Name"),
            gridField(fid("studentNumber"), 6, "Student Number"),
            gridField(fid("dateOfBirth"), 6, "Date of Birth")
        ]);
        const guardian = section(root + "_g", "Guardian", [
            gridField(fid("guardianName"), 6, "Guardian Name"),
            gridField(fid("guardianContact"), 6, "Guardian Contact")
        ]);
        return { sx: { p: 2, maxWidth: 720, minWidth: 360, mx: 'auto' },
                 elements: { [identity.id]: identity, [guardian.id]: guardian } };
    } };
})();