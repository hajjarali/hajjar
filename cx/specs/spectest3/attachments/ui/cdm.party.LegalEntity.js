(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label, helper) {
        const props = { label: label, variant: "outlined" };
        if (helper) { props.helperText = helper; }
        const el = viewUtils.buildUIElement(id, props);
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    function section(sectionId, title, items) {
        const grid = sectionId + "_g";
        const children = {};
        for (const it of items) { children[it.id] = it; }
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 3 } }, elements: {
            [sectionId + "_t"]: { id: sectionId + "_t", jsontype: "mui.typography",
                props: { variant: "subtitle2", children: title,
                         sx: { textTransform: 'uppercase', letterSpacing: '0.08em',
                               fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary',
                               pb: 0.75, mb: 1.5, borderBottom: '1px solid', borderColor: 'divider' } } },
            [grid]: { id: grid, jsontype: "mui.paper",
                props: { elevation: 0,
                         sx: { border: '1px solid', borderColor: 'divider',
                               borderRadius: 2, p: 2.5, bgcolor: 'background.paper' } },
                elements: { [grid + "_in"]: { id: grid + "_in", jsontype: "mui.grid",
                    props: { container: true, columns: 12, spacing: 2.5 }, elements: children } } } } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);

        const basics = section(root + "_b", "Legal Entity", [
            gridField(fid("name"), 12, "Name", "The legal entity's official name.")
        ]);

        const identifiers = section(root + "_i", "Entity Identifiers", [
            gridField(fid("entityIdentifier"), 12, "Identifiers",
                "LEI, BIC, MIC, REDID, country code or other. An LEI is exactly 20 alphanumeric characters.")
        ]);

        return { sx: { p: 3, minWidth: 360, maxWidth: 760, mx: 'auto', bgcolor: 'background.default' },
                 elements: { [basics.id]: basics, [identifiers.id]: identifiers } };
    } };
})();