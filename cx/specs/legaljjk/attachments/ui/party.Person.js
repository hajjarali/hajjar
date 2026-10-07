(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function section(sectionId, title, items) {
        const grid = sectionId + "_g";
        const children = {};
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
        const root = model.getId() + "_root";

        const nameEl = viewUtils.buildUIElement(model.fieldNameToModelId("name"),
            { label: "Name", variant: "outlined" });
        const ageEl = viewUtils.buildUIElement(model.fieldNameToModelId("age"),
            { label: "Age", variant: "outlined", helperText: "Whole years, 0–150." });
        const statusEl = viewUtils.buildUIElement(model.fieldNameToModelId("status"),
            { label: "Status", variant: "outlined" });

        const nameCell = { id: nameEl.id + "_gi", jsontype: "mui.grid", props: { size: 6 },
            elements: { [nameEl.id]: nameEl } };
        const ageCell = { id: ageEl.id + "_gi", jsontype: "mui.grid", props: { size: 3 },
            elements: { [ageEl.id]: ageEl } };
        const statusCell = { id: statusEl.id + "_gi", jsontype: "mui.grid", props: { size: 3 },
            elements: { [statusEl.id]: statusEl } };

        const details = section(root + "_details", "Person", [nameCell, ageCell, statusCell]);
        return { sx: { p: 2, minWidth: 320, maxWidth: 720, mx: 'auto' }, elements: { [details.id]: details } };
    } };
})();